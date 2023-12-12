

import Messages from "messages";
import path from "path";
import Excel from "exceljs";
import fs from 'fs';
import moment from "moment";
import converter from 'number-to-words'
import invoiceService from "@/services/invoiceServices/invoice.service";

let createInvoice = async (id, invoiceCred,fileUrl,newFileUrl) => {
    const invoiceServices = new invoiceService();
    let addFile
    try {
       
        const rateCond = { product: { $in: invoiceCred.data.product }, bank: invoiceCred.data.bank, area: { $in: invoiceCred.data.area }, }
        const rates = await invoiceServices.getAllRate(rateCond);

        const rangeValues = {}
        rates.map((item) => {
            const { product, from, to, point } = item;
            const key = `${product}`;
            const value = `${from}-${to}-${point}`;

            if (!rangeValues[key]) {
                rangeValues[key] = [];
            }

            rangeValues[key].push(value);
        });

        const cond = { uniqueId: invoiceCred.uniqueId };
        const data = await invoiceServices.allInvoiceExcelData(cond, { distance: 1, rate: 1, point: 1, product: 1 });


        const productWiseData = {};
        let finalData: any = {
            totalCount: 0,
            totalAmount: 0
        }
        invoiceCred.data.product.map((product) => {
            productWiseData[product] = {}
            rangeValues[product].forEach(range => {

                const [minDistance, maxDistance, point] = range.split('-').map(Number);

                const targetPoint = [point];

                const matchingData = data.filter(item => {
                    const isInRange = item.product === product && (item.distance >= minDistance && item.distance <= maxDistance) && targetPoint.includes(item.point);

                    return isInRange;
                });

                const count = matchingData.length;
                productWiseData[product][range] = {};
                productWiseData[product][range]['count'] = count;
                productWiseData[product][range]['rate'] = matchingData?.[0]?.rate || 0;
                finalData['totalAmount'] += count * (matchingData?.[0]?.rate || 0);
                finalData['totalCount'] += count;
            });
        });

        switch (invoiceCred.data.invoiceFormat) {
            case 'format_1':
                var workbook = new Excel.Workbook();
                await workbook.xlsx.readFile(`${fileUrl}invoice_format/format_1.xlsx`).then(async function () {

                    var worksheet = workbook.getWorksheet(1)
                    var row = worksheet.getRow(1);
                    row.getCell(1).value = invoiceCred.data?.invoiceFrom?.[0]?.companyName || '';
                    var row = worksheet.getRow(2);
                    row.getCell(1).value = invoiceCred.data?.invoiceFrom?.[0]?.address || '';
                    var row = worksheet.getRow(3);
                    row.getCell(3).value = invoiceCred.data?.invoiceFrom?.[0]?.pan || '';
                    row.getCell(8).value = invoiceCred.data?.invoiceFrom?.[0]?.gstNumber || '';
                    var row = worksheet.getRow(5);
                    row.getCell(2).value = invoiceCred.data?.invoiceFrom?.[0]?.billNo || '';
                    row.getCell(8).value = `${moment(invoiceCred.data.dateFrom).utc().format('MMMM YYYY') + '-' + moment(invoiceCred.data.dateTo).utc().format('MMMM YYYY')}`;
                    var row = worksheet.getRow(6);
                    row.getCell(2).value = moment().utc().format('DD/MM/YYYY');
                    var row = worksheet.getRow(10);
                    row.getCell(1).value = invoiceCred.data?.invoiceTo?.[0]?.companyName || ''
                    var row = worksheet.getRow(11);
                    row.getCell(1).value = invoiceCred.data?.invoiceTo?.[0]?.address || ''
                    var row = worksheet.getRow(12);
                    row.getCell(3).value = invoiceCred.data?.invoiceFrom?.[0]?.pan || ''
                    var row = worksheet.getRow(13);
                    row.getCell(3).value = invoiceCred.data?.invoiceFrom?.[0]?.gstNumber || ''
                    var row = worksheet.getRow(14);
                    row.getCell(3).value = invoiceCred.data?.invoiceFrom?.[0]?.sacNumber || ''
                    var row = worksheet.getRow(15);
                    row.getCell(3).value = invoiceCred.data?.invoiceFrom?.[0]?.stateCode || '';
                    var row = worksheet.getRow(16);
                    row.getCell(2).value = invoiceCred.data?.invoiceFrom?.[0]?.period || '';

                    let numberOfRowsToAdd = 0
                    invoiceCred.data.product.map((product) => {
                        numberOfRowsToAdd += rangeValues[product].length
                    });
                    worksheet.duplicateRow(19, numberOfRowsToAdd, true);
                    let newRowNumber = 19;
                    for (let i = 0; i < invoiceCred.data.product.length; i++) {
                        for (let j = 0; j < rangeValues[invoiceCred.data.product[i]].length; j++) {
                            var row = worksheet.getRow(newRowNumber);
                            row.getCell(1).value = (i * rangeValues[invoiceCred.data.product[i]].length) + j + 1;
                            row.getCell(2).value = `No.of CPV fired for ${invoiceCred.data.product[i]} -> ${rangeValues[invoiceCred.data.product[i]][j]}  `;
                            row.getCell(6).value = productWiseData[invoiceCred.data.product[i]][rangeValues[invoiceCred.data.product[i]][j]]['count']
                            row.getCell(8).value = productWiseData[invoiceCred.data.product[i]][rangeValues[invoiceCred.data.product[i]][j]]['rate']
                            row.getCell(9).value = productWiseData[invoiceCred.data.product[i]][rangeValues[invoiceCred.data.product[i]][j]]['rate']
                            row.getCell(10).value = productWiseData[invoiceCred.data.product[i]][rangeValues[invoiceCred.data.product[i]][j]]['rate'] * productWiseData[invoiceCred.data.product[i]][rangeValues[invoiceCred.data.product[i]][j]]['count'];
                            newRowNumber++
                        }
                    }

                    const currentRow = newRowNumber + 1
                    var row = worksheet.getRow(currentRow);
                    row.getCell(6).value = finalData['totalCount'];
                    row.getCell(10).value = finalData['totalAmount'];
                    var row = worksheet.getRow(currentRow + 1);
                    row.getCell(10).value = (finalData['totalAmount']) * (.09);
                    var row = worksheet.getRow(currentRow + 2);
                    row.getCell(10).value = finalData['totalAmount'] * (.09);
                    var row = worksheet.getRow(currentRow + 3);
                    row.getCell(10).value = (finalData['totalAmount']) * (.09) + (finalData['totalAmount']) * (.09) + finalData['totalAmount'];
                    var row = worksheet.getRow(currentRow + 4);
                    row.getCell(2).value = converter.toWords(worksheet.getCell(currentRow + 3, 10).value as number);
                    var row = worksheet.getRow(currentRow + 7);
                    row.getCell(2).value = `This bill for the month of ${moment().utc().format('MMMM YYYY')} & has not been billed before.`;
                    var row = worksheet.getRow(currentRow + 8);
                    row.getCell(5).value = invoiceCred.data.invoiceFrom[0].accountNo;


                    row.commit();
                    await workbook.xlsx.writeFile(newFileUrl);
                });
                fs.access(newFileUrl, fs.constants.F_OK, async (err) => {
                    if (err) {
                        await invoiceServices.updateInvoiceStatus({ _id: id}, { $set: { error: err.message, status: "failed" } })
                    } else {
                        await invoiceServices.updateInvoiceStatus({ _id: id}, { $set: { status: "success" } })
                    }
                });
                break;

            case 'format_2':
                var workbook = new Excel.Workbook();
                await workbook.xlsx.readFile(`${fileUrl}invoice_format/format_2.xlsx`).then(async function () {

                    var worksheet = workbook.getWorksheet(1);

                    var row = worksheet.getRow(2);
                    row.getCell(2).value = invoiceCred.data?.invoiceFrom?.[0]?.pan || '';
                    row.getCell(12).value = invoiceCred.data?.invoiceTo?.[0]?.pan || '';

                    var row = worksheet.getRow(3);
                    row.getCell(2).value = invoiceCred.data?.invoiceFrom?.[0]?.gstNumber || '';
                    row.getCell(12).value = invoiceCred.data?.invoiceFrom?.[0]?.gstNumber || '';

                    var row = worksheet.getRow(4);
                    row.getCell(2).value = invoiceCred.data?.invoiceFrom?.[0]?.gstRegistrationState || '';
                    row.getCell(12).value = invoiceCred.data?.invoiceTo?.[0]?.placeOfSupply || '';

                    var row = worksheet.getRow(5);
                    row.getCell(2).value = moment(invoiceCred.data?.dateFrom).utc().format('MMMM YYYY');
                    row.getCell(12).value = invoiceCred.data?.invoiceTo.address;

                    var row = worksheet.getRow(6);
                    row.getCell(2).value = moment().utc().format('DD/MM/YYYY');

                    var row = worksheet.getRow(7);
                    row.getCell(2).value = '';

                    var row = worksheet.getRow(11);
                    const rowNo = 2;
                    for (let i = 0; i < invoiceCred.data.product.length; i++) {
                        row.getCell(rowNo + i).value = invoiceCred.data?.product[i];
                    };

                    let numberOfRowsToAdd = 0
                    invoiceCred.data.product.map((product) => {
                        numberOfRowsToAdd += rangeValues[product].length
                    });
                    worksheet.duplicateRow(19, numberOfRowsToAdd, true);
                    let newRowNumber = 19;
                    // for (let i = 0; i < invoiceCred.data.product.length; i++) {
                    //     for (let j = 0; j < rangeValues[invoiceCred.data.product[i]].length; j++) {
                    //         var row = worksheet.getRow(newRowNumber);
                    //         row.getCell(6).value = productWiseData[invoiceCred.data.product[i]][rangeValues[invoiceCred.data.product[i]][j]]['count']
                    //         row.getCell(8).value = productWiseData[invoiceCred.data.product[i]][rangeValues[invoiceCred.data.product[i]][j]]['rate']
                    //         row.getCell(9).value = productWiseData[invoiceCred.data.product[i]][rangeValues[invoiceCred.data.product[i]][j]]['rate']
                    //         row.getCell(10).value = productWiseData[invoiceCred.data.product[i]][rangeValues[invoiceCred.data.product[i]][j]]['rate'] * productWiseData[invoiceCred.data.product[i]][rangeValues[invoiceCred.data.product[i]][j]]['count'];
                    //         newRowNumber++
                    //     }
                    // }


                    // for (let i = 0; i < rangeValues[invoiceCred.data.product[i]].length; i++) {
                    //     for (let j = 0; j < invoiceCred.data.product.length; j++) {
                    //         if (rangeValues[invoiceCred.data.product[j]]) {
                    //             var row = worksheet.getRow(newRowNumber);
                    //             row.getCell(j + 2).value = productWiseData[invoiceCred.data.product[j]][rangeValues[invoiceCred.data.product[j]][i]]['count'];
                    //         }
                    //     }
                    //     row.getCell(invoiceCred.data.product.length+).value
                    //     newRowNumber++
                    // }





                    var row = worksheet.getRow(10);
                    row.getCell(1).value = invoiceCred.data?.invoiceTo?.[0]?.companyName || ''
                    var row = worksheet.getRow(11);
                    row.getCell(1).value = invoiceCred.data?.invoiceTo?.[0]?.address || ''
                    var row = worksheet.getRow(12);
                    row.getCell(3).value = invoiceCred.data?.invoiceFrom?.[0]?.pan || ''
                    var row = worksheet.getRow(13);
                    row.getCell(3).value = invoiceCred.data?.invoiceFrom?.[0]?.gstNumber || ''
                    var row = worksheet.getRow(14);
                    row.getCell(3).value = invoiceCred.data?.invoiceFrom?.[0]?.sacNumber || ''
                    var row = worksheet.getRow(15);
                    row.getCell(3).value = invoiceCred.data?.invoiceFrom?.[0]?.stateCode || '';
                    var row = worksheet.getRow(16);
                    row.getCell(2).value = invoiceCred.data?.invoiceFrom?.[0]?.period || '';

                    var row = worksheet.getRow(19);
                    row.getCell(1).value = 1;
                    row.getCell(2).value = `No.of CPV fired for ${invoiceCred.data.product[0]}  Single Point(Local)`;
                    row.getCell(6).value = productWiseData[invoiceCred.data.product[0]]['0-25-1']['count']
                    row.getCell(8).value = productWiseData[invoiceCred.data.product[0]]['0-25-1']['rate']
                    row.getCell(9).value = productWiseData[invoiceCred.data.product[0]]['0-25-1']['rate']
                    row.getCell(10).value = productWiseData[invoiceCred.data.product[0]]['0-25-1']['rate'] * productWiseData[invoiceCred.data.product[0]]['0-25-1']['count'];
                    var row = worksheet.getRow(20);
                    row.getCell(1).value = 2;
                    row.getCell(2).value = `No.of CPV fired for ${invoiceCred.data.product[0]}  Single Point(Above 25 Km)`;
                    row.getCell(6).value = productWiseData[invoiceCred.data.product[0]]['25-50-1']['count']
                    row.getCell(8).value = productWiseData[invoiceCred.data.product[0]]['25-50-1']['rate']
                    row.getCell(9).value = productWiseData[invoiceCred.data.product[0]]['25-50-1']['rate']
                    row.getCell(10).value = productWiseData[invoiceCred.data.product[0]]['25-50-1']['rate'] * productWiseData[invoiceCred.data.product[0]]['25-50-1']['count'];
                    var row = worksheet.getRow(21);
                    row.getCell(1).value = 3;
                    row.getCell(2).value = `No.of CPV fired for ${invoiceCred.data.product[0]} Double Point(Local)`;
                    row.getCell(6).value = productWiseData[invoiceCred.data.product[0]]['0-25-2']['count']
                    row.getCell(8).value = productWiseData[invoiceCred.data.product[0]]['0-25-2']['rate']
                    row.getCell(9).value = productWiseData[invoiceCred.data.product[0]]['0-25-2']['rate']
                    row.getCell(10).value = productWiseData[invoiceCred.data.product[0]]['0-25-2']['rate'] * productWiseData[invoiceCred.data.product[0]]['0-25-2']['count'];
                    var row = worksheet.getRow(22);
                    row.getCell(1).value = 4;
                    row.getCell(2).value = `No.of CPV fired for ${invoiceCred.data.product[0]} Double Point(Above 25 Km)`;
                    row.getCell(6).value = productWiseData[invoiceCred.data.product[0]]['25-50-2']['count']
                    row.getCell(8).value = productWiseData[invoiceCred.data.product[0]]['25-50-2']['rate']
                    row.getCell(9).value = productWiseData[invoiceCred.data.product[0]]['25-50-2']['rate']
                    row.getCell(10).value = productWiseData[invoiceCred.data.product[0]]['25-50-2']['rate'] * productWiseData[invoiceCred.data.product[0]]['25-50-2']['count'];
                    var row = worksheet.getRow(23);
                    row.getCell(1).value = 5;
                    row.getCell(2).value = `No.of CPV fired for ${invoiceCred.data.product[0]} cases(Above 50 Km)`;
                    row.getCell(6).value = productWiseData[invoiceCred.data.product[0]]['>50']['count']
                    row.getCell(8).value = productWiseData[invoiceCred.data.product[0]]['>50']['rate']
                    row.getCell(9).value = productWiseData[invoiceCred.data.product[0]]['>50']['rate']
                    row.getCell(10).value = productWiseData[invoiceCred.data.product[0]]['>50']['rate'] * productWiseData[invoiceCred.data.product[0]]['>50']['count'];
                    var row = worksheet.getRow(24);
                    row.getCell(6).value = productWiseData[invoiceCred.data.product[0]]['>50']['count'] + productWiseData[invoiceCred.data.product[0]]['25-50-2']['count'] + productWiseData[invoiceCred.data.product[0]]['0-25-2']['count'] + productWiseData[invoiceCred.data.product[0]]['25-50-1']['count'] + productWiseData[invoiceCred.data.product[0]]['0-25-1']['count']
                    row.getCell(10).value = productWiseData[invoiceCred.data.product[0]]['0-25-1']['rate'] * productWiseData[invoiceCred.data.product[0]]['0-25-1']['count'] + productWiseData[invoiceCred.data.product[0]]['25-50-1']['rate'] * productWiseData[invoiceCred.data.product[0]]['25-50-1']['count'] + productWiseData[invoiceCred.data.product[0]]['0-25-2']['rate'] * productWiseData[invoiceCred.data.product[0]]['0-25-2']['count'] + productWiseData[invoiceCred.data.product[0]]['25-50-2']['rate'] * productWiseData[invoiceCred.data.product[0]]['25-50-2']['count'] + productWiseData[invoiceCred.data.product[0]]['>50']['rate'] * productWiseData[invoiceCred.data.product[0]]['>50']['count']
                    var row = worksheet.getRow(25);
                    row.getCell(10).value = (worksheet.getCell(24, 10).value as number) * (.09);
                    var row = worksheet.getRow(26);
                    row.getCell(10).value = (worksheet.getCell(24, 10).value as number) * (.09);
                    var row = worksheet.getRow(27);
                    row.getCell(10).value = (worksheet.getCell(24, 10).value as number) + (worksheet.getCell(25, 10).value as number) + (worksheet.getCell(26, 10).value as number);
                    var row = worksheet.getRow(28);
                    row.getCell(2).value = converter.toWords(worksheet.getCell(27, 10).value as number);
                    var row = worksheet.getRow(31);
                    row.getCell(2).value = `This bill for the month of ${moment().utc().format('MMMM YYYY')} & has not been billed before.`;
                    var row = worksheet.getRow(32);
                    row.getCell(5).value = invoiceCred.data.invoiceFrom[0].accountNo;

                    row.commit();
                    await workbook.xlsx.writeFile(newFileUrl);
                });
                fs.access(newFileUrl, fs.constants.F_OK, async (err) => {
                    if (err) {
                        await invoiceServices.updateInvoiceStatus({ _id: addFile._id }, { $set: { error: err.message, status: "failed" } })
                    } else {
                        await invoiceServices.updateInvoiceStatus({ _id: addFile._id }, { $set: { status: "success" } })
                    }
                });
                break;

            default:
                break;
        }
    } catch (err) {
        console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",err)
        return await invoiceServices.updateInvoiceStatus({ _id: id }, { $set: { error: err.message, status: "failed" } })
    }
}
export default createInvoice
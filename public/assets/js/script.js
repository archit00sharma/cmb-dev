


function ajaxCall(url, method, args, binary = false) {
	let res;
	if (binary) {
		res = $.ajax({
			url: url,
			type: method,
			data: args,
			success: function (data) {},
			async: false,
			processData: false,
			contentType: false,
			error: function (err) {
				console.log("err ajaxCall ==>", err);
			},
		}).responseText;
	} else {
		res = $.ajax({
			url: url,
			type: method,
			data: args,
			success: function (data) {},
			async: false,
			error: function (err) {
				console.log("err ajaxCall ==>", err);
			},
		}).responseText;
	}
	return res;
}


async function checkSecurityCode() {
    const first = document.getElementById("first").value
    const second = document.getElementById("second").value
    const third = document.getElementById("third").value
    const fourth = document.getElementById("fourth").value
    const fifth = document.getElementById("fifth").value
    const sixth = document.getElementById("sixth").value
	const securityCode = first+""+second+""+third+""+fourth+""+fifth+""+sixth;
	console.log("security code", securityCode)
	$("#security-code-input").val(securityCode)


	

	
	

}


function singleCheck(input) {
	console.log(input.value)
	
	if(!input.checked) {
		$('#selectAllCheckBox').prop('checked', false);
	}

	var checks = document.querySelectorAll('#checkboxBody input[type="checkbox"]');

	checkCount = 0;
	checks.forEach((node) => {
		if(node.value!="selectAll") {
			if(node.checked) checkCount+=1;
		}
	});

	if(checkCount==checks.length-1) {
		$('#selectAllCheckBox').prop('checked', true);
		// $("#markAsCollected").disabled = false
		$('#markAsCollected').prop('disabled', false);

	} else {
		$('#markAsCollected').prop('disabled', true);

	}

	// console.log("all checked", allChecked)

	
}

onload = runme();

function runme(){
	const flashMessage = document.getElementById('flashMessage');
	console.log('flash message', flashMessage.innerHTML);
	console.log('flash message length', flashMessage.innerHTML.length);
	if(flashMessage.innerHTML.length > 0){
		flashMessage.classList.add('active');
	}

	setTimeout(() => {
		flashMessage.classList.remove('active');
	}, 2000);

}


function checkUnCheck(data) {
	const selectAll = data.checked;

	var checks = document.querySelectorAll('#checkboxBody input[type="checkbox"]');
	checks.forEach((node) => {
		if(selectAll) {
			$('#markAsCollected').prop('disabled', false);
			node.checked = true;
		} else {
			$('#markAsCollected').prop('disabled', true);
			node.checked = false;
		}
	});
}
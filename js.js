//Получение значений
parentForResult = document.getElementById('result')
validValue =[1, 2, 3, 4, 5, 6, 7, 8, 9, 10,]
pageNumber = document.getElementById('pageNumber').value
limit = document.getElementById('limit').value
btn = document.getElementById('send');
btn.addEventListener( 'click', () => {
	pageNumber = document.getElementById('pageNumber').value
	limit = document.getElementById('limit').value
	limit = limit*1
	pageNumber = pageNumber*1

	// Создаем promise 
	const myPromise = new Promise((resolve, reject) => {
		if ( validValue.indexOf(limit) >= 0 && validValue.indexOf(pageNumber) >= 0 ) {
			resolve({
				pageNumber: pageNumber,
				limit: limit,
				message: "Получение данных с сервера"
			});
		} else {
			if(validValue.indexOf(pageNumber) == -1 && validValue.indexOf(limit) == -1){
				reject({
					message: "Номер страницы и лимит вне диапазона от 1 до 10"
				})
			}
			if(validValue.indexOf(pageNumber) == -1){
				reject({
					message: "Номер страницы вне диапазона от 1 до 10"
				})
			}
			if(validValue.indexOf(limit) == -1){
				reject({
					message: "Лимит вне диапазона от 1 до 10"
				})
			}
		}
	});
	myPromise
	// then 
	.then((resolve) => {
		console.log(resolve.message)
		let xhr = new XMLHttpRequest();
		xhr.open('GET', `https://picsum.photos/v2/list?page=${pageNumber}&limit=${limit}`);
		xhr.onload = function() {
			result = JSON.parse(xhr.response);
			console.log('Результат: ', result);
			parsing(result,finaling);
		};
		xhr.onerror = function() {
			parentForResult.innerHTML = '<p>Ошибка доступа к серверу</p>'
			console.log('Результат: error ');
		};
		xhr.send()
	})
	// catch для обработки ошибки
  	.catch((error) => {
  		parentForResult.innerHTML = `<p>${error.message}</p>`
   	console.log('Результат: ', error.message);
   	localStorage.removeItem('last request')
	})
  	document.getElementById('pageNumber').value = ''
	document.getElementById('limit').value = ''
});

//Вывод фотографий и парсинг

function parsing(answer, callback){
	parentForResult.innerHTML = ''
	length = answer.length*1
	lastAnswer = parentForResult.querySelectorAll('div')
	console.log(lastAnswer)
	if(lastAnswer.length){
		parentForResult.innerHTML =''
	}
	for( i = 0 ; i < answer.length*1 ; i++){
		id = answer[i]['id']
		download_url = answer[i]['download_url']
		author = answer[i]['author']
		width = answer[i]['width'] + 'px'
		height = answer[i]['height'] + 'px'
		url = answer[i]['url']
		card = document.createElement("div")
		infoPhoto = document.createElement("p")
		card.innerHTML = `<img id='${id}' src='${download_url}' style="
			background-size: cover;
			max-width: 500px;
			">`
		infoPhoto.innerHTML = `Автор: ${author}; Источник: <a href='${url}'>${url}</a>`
		parentForResult.prepend(card)
		card.append(infoPhoto)
		//document.body.insertBefore(card, parent)
		//document.body.insertBefore(infoPhoto, parent)
	}
	callback(parentForResult.innerHTML)
	console.log('выполнено')
}

//Сохранение данных в хранилище
function finaling(final){
	localStorage.setItem('last request', `${final}`)
}

parentForResult.innerHTML = localStorage.getItem('last request')
localStorage.clear()

window.onload = function() {
	if (localStorage.getItem('last request')){
		parentForResult.innerHTML = ''
		localStorage.clear()
	}
};
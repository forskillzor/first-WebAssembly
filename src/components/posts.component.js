import { Component } from '../core/component'
import { apiService } from '../services/api.service'
import { TransformService } from '../services/transform.service'
import { renderPost } from '../templates/post.template'

export class PostsComponent extends Component{
	constructor(id, {loader}){
		super(id)
		this.loader = loader
	}

	init(){
		this.$el.addEventListener('click', buttonHandler.bind(this))
	}

	async onShow(){
		this.loader.show()
		const fbData = await apiService.fetchPosts()
		this.loader.hide()
		const posts = TransformService.fbObjectToArray(fbData)
		const html = posts.map(post => renderPost(post, {withButton: true}))
		//console.log(posts)

		this.$el.insertAdjacentHTML('afterbegin', html.join(' '))
	}

	onHide(){
		this.$el.innerHTML = ''
	}
}

function buttonHandler(event){
	const $el = event.target
	const id = $el.dataset.id
	const title = $el.dataset.title
	
	if (event.target.dataset.id){
		
		let favorites = JSON.parse(localStorage.getItem('favorites')) || []
		const candidate = favorites.find(p => p.id ===id)
		//console.log(favorites)
		
		if(candidate){
			//delete item
			$el.textContent = 'Сохранить'
			$el.classList.add('button-primary')
			$el.classList.remove('button-danger')
			favorites = favorites.filter(p => p.id !== id)
		}
		else{
			//add item
			$el.classList.remove('button-primary')
			$el.classList.add('button-danger')
			favorites.push({id, title})
			$el.textContent = 'Удалить'
		}
		localStorage.setItem('favorites', JSON.stringify(favorites))
	}
}
import React, { useEffect, useState } from "react";

//create your first component
const Home = () => {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState('');
	const [newUser, setNewUser] = useState('')
	const [selectedUserTodos, setSelectedUserTodos] = useState()
	const [newTask, setNewTask] = useState('')

	useEffect(() => {
		//fetch por promesas
		fetch('https://playground.4geeks.com/todo/users')
			.then(resp => {
				console.log(resp)

				if (!resp.ok) {

					throw new Error(`${resp.status} ${resp.statusText}`)
				}
				return resp.json() //aqui transformamos la respuesta de texto a objeto js
			})
			.then(data => setUsers(data.users))
			.catch(error => console.log('error recibido --//--> ', error))
	}, [selectedUser]) // array de dependencias vacio para que se ejecute onLoad y una vez.


	useEffect(() => {
		if (selectedUser !== '') {
			fetch('https://playground.4geeks.com/todo/users/' + selectedUser)
				.then(resp => {
					console.log(resp)

					if (!resp.ok) {

						throw new Error(`${resp.status} ${resp.statusText}`)
					}
					return resp.json() //aqui transformamos la respuesta de texto a objeto js
				})
				.then(data => setSelectedUserTodos(data.todos))
				.catch(error => console.log('error recibido --//--> ', error))
		}
	}, [selectedUser])

	const handleUserCreation = (e) => {
		e.preventDefault();
		//fetch tipo POST
		fetch('https://playground.4geeks.com/todo/users/' + newUser, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}

		})
			.then(resp => {
				console.log(resp)

				if (!resp.ok) {
					throw new Error(`${resp.status} ${resp.statusText}`)
				}
			
				return resp.json() //aqui transformamos la respuesta de texto a objeto js
			})
			.then(data => console.log('fetch para newUser ---> ', data))
			

			.catch(error => console.log('error recibido --//--> ', error))
		setNewUser("")
		return fetch('https://playground.4geeks.com/todo/users');
	}

	const handleNewTodo = e => {
		e.preventDefault()
		if (!selectedUser) return alert('need to select a user first')
		//fetch tipo POST con body
		fetch('https://playground.4geeks.com/todo/todos/' + selectedUser, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"label": newTask,
				"is_done": false
			})
		})
			.then(resp => resp.json)
			.then(data => console.log(data))
			.catch(error => console.log(error))
	}

	const handleDeleteUser = (e) => {
		e.preventDefault();
		//fetch DELETE
		fetch('https://playground.4geeks.com/todo/users/' + selectedUser, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(resp => {
				console.log(resp)

				if (!resp.ok) {
					throw new Error(`${resp.status} ${resp.statusText}`)
				}
				setSelectedUser("")
			})
			.catch(error => console.log('error recibido --//--> ', error))
	}

	const handleDeleteTask = (todoId) => {
		if (!selectedUser) return alert('Necesitas seleccionar un usuario primero');

		fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(resp => {
				if (!resp.ok) {
					throw new Error(`${resp.status} ${resp.statusText}`);
				}
				return resp.json();
			})
			.then(data => {
				console.log("Tarea eliminada:", data);
				// Refrescar lista de todos
				return fetch(`https://playground.4geeks.com/todo/users/${selectedUser}`);
			})
			.then(resp => resp.json())
			.then(data => setSelectedUserTodos(data.todos))
			.catch(error => console.log("Error al borrar la tarea:", error));
	};


	return (
		<>
			<div className="text-center">


				<p className="fs-5">Listado de usuario</p>
				{users?.map(el =>
					<div
						className="container card my-3"
						key={el.id}
						onClick={() => setSelectedUser(el.name)}
					><p>user: <span>{el.name}</span></p></div>)}
			</div>

			<div className="card container, text-center">
				<p className="fs-5">Creacion de Usuario</p>
				<p>
					Ingresa el nombre del usuario
				</p>

				<form onSubmit={handleUserCreation}>
					<input type="text"
						value={newUser}
						onChange={e => setNewUser(e.target.value)}
					/>
					<input className="btn btn-primary" type="submit" />
				</form>


			</div>
			<button className="text-center, btn btn-danger" onClick={handleDeleteUser} >
				Borrar usuario
			</button>


			<p className="text-center">Cuando selecciones un usuario, se cargaran sus todos</p>
			<p className="fs-5 text-center">El usuario seleccionado es: {selectedUser} </p>
			<p className="fs-5, text-center">
				Lista de Todos en usuario: {selectedUser}
			</p>

			<form onSubmit={handleNewTodo}>
				<p className="fs-5">Crear una nueva tarea para: {selectedUser}</p>
				<input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} />
				<input type="submit" />
			</form>

			{selectedUserTodos?.map(el => (
				<div key={el.id} className="card bg-info my-2 p-2 d-flex flex-row justify-content-between align-items-center">
					<p className="m-0">{el.label}</p>
					<button className="btn btn-danger btn-sm" onClick={() => handleDeleteTask(el.id)}>Eliminar</button>
				</div>
			))}

		</>
	);
};

export default Home;
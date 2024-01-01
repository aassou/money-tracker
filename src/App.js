import './App.css'
import { useState, useEffect } from 'react'

function App() {
	const [name, setName] = useState('')
	const [datetime, setDatetime] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState('')
	const [transactions, setTransactions] = useState([])
  const [balance, setBalance] = useState(0)

	useEffect(() => {
    getTransactions().then((transactions) => {
      let sum = 0;
  
      for (const transaction of transactions) {
        const transactionPrice = parseFloat(transaction.price);
  
        if (!isNaN(transactionPrice)) {
          sum += transactionPrice;
        }
      }
  
      setTransactions(transactions);
      setBalance(sum);
    });
  }, []);

	
	async function getTransactions() {
		const url = process.env.REACT_APP_API_URL + '/transactions'
		const response = await fetch(url)
		
		return await response.json()
	}
	
	function addNewTransaction(ev) {
		ev.preventDefault()
		const url = process.env.REACT_APP_API_URL + '/transaction'
		console.log(url)
		
		fetch(url, {
			method: 'POST',
			headers: {'Content-Type':'application/json'},
			body: JSON.stringify({
				name, 
				description, 
				datetime, 
				price
			})
		}).then(async response => {
			response.json().then(json => {
				console.log('result', json)
			})

      const updatedTransactions = await getTransactions();
      setTransactions(updatedTransactions);

			setName('')
      setPrice('')
      setDescription('')
      setDatetime('')
		})
	}

	return (
		<main>
			<h1>$ {balance}<span>.00</span></h1>
			<form onSubmit={addNewTransaction}>
				<div className='basic'>
					<input 
						type='text'
						value={name}
						onChange={ev => setName(ev.target.value)}
						placeholder={'New Samsung TV'}
					/>
					<input 
						type='number'
						value={price}
						onChange={ev => setPrice(ev.target.value)}
						placeholder={'1200'}
					/>
					<input 
						type='datetime-local'
						value={datetime}
						onChange={ev => setDatetime(ev.target.value)}
					/>
				</div>
				<div className='description'>
					<input 
						type='text'
						value={description}
						onChange={ev => setDescription(ev.target.value)}
						placeholder={'description'}
					/>
				</div>
				<button type='submit'>Add new transaction</button>
			</form>
			<div className='transactions'>
				{transactions.length > 0 && transactions.map((transaction, id) => (
					<div className='transaction' key={id}>
						<div className='left'>
							<div className='name'>{transaction.name}</div>
							<div className='description'>{transaction.description}</div>
						</div>
						<div className='right'>
							<div className={(transaction.price < 0) ? 'price red' : 'price green' }>
                $ {transaction.price}
              </div>
							<div className='datetime'>{transaction.datetime}</div>
						</div>
					</div>
				))}
			</div>
		</main>
	)
}

export default App

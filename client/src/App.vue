<template>
	<div id="app">
		<div id="nav">
			<router-link tag="button" to="/current-usage">Huidig</router-link>
			<router-link tag="button" to="/last-minute">Minuut</router-link>
			<router-link tag="button" to="/last-hour">Uur</router-link>
			<router-link tag="button" to="/last-day">Dag</router-link>
		</div>
		<div class="container">
			<router-view/>
		</div>
	</div>
</template>

<style>
html, body{
	padding:0;
	margin: 0;
	box-sizing: border-box;
	width: 480px;
	height: 320px;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	display: flex;
	flex-direction: row;
}

#nav {
	width: 80px;
	padding: 5px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color:#131313;
}


#nav a.router-link-exact-active {
	color: #42b983;
}

.container{
	width: 400px;
	height: 320px;
}

#nav > * {
	width: 100%;
	margin: 5px 0;
	background-color: #2c3e50;
	border: none;
	border-radius: 3px;
	padding: 10px 20px;
	color: white;
}

#nav > *.router-link-active {
	background-color: #50667c;
}
</style>

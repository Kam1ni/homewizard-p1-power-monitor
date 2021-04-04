<template>
	<div id="app">
		<div id="nav">
			<router-link to="/last-minute">Laatste minuut</router-link> |
			<router-link to="/last-hour">Laatste uur</router-link> | 
			<router-link to="/last-day">Laatste 24 uur</router-link>
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
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 5px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
	font-size: 10px;

}

#nav a.router-link-exact-active {
	color: #42b983;
}

.container{
	width: 480px;
	height: 292px;
}
</style>

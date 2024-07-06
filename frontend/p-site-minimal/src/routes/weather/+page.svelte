<script lang="ts">
    import { onMount } from 'svelte';
	import Current from './current.svelte';

	let data;

	const forecast = async () => {
		const response =  await fetch('/weather');	
		data = await response.json();
		debugger;
	}

	onMount(() => {
		forecast()
	})
    
</script>

<Current	
	updatedAt = { data?.current?.last_updated }
	location = { data?.location.name }
	condition = { data?.current.condition.text }
	temp = { data?.current.temp_c }
	feelslike = { data?.current.feelslike_c }
	windkph = { data?.current.wind_kph }
	humidity = { data?.current.humidity }
	/>

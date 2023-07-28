document.addEventListener("DOMContentLoaded", function () {
    const apiKey = '192c3636c896b493df76ee71';
    let participants = 1;
  
    async function calculateFootprint() {
      const apiUrl = 'https://api.goclimate.com/v1/flight_footprint';
  
      const participants = parseInt(document.getElementById('participants').value);
      const originCity = document.getElementById('origin').value.toLowerCase();
      const destinationCity = document.getElementById('destination').value.toLowerCase();
      const cabinClass = document.getElementById('cabinClass').value;
  
      try {
        const originAirportCode = airportMap[originCity];
        const destinationAirportCode = airportMap[destinationCity];
  
        if (!originAirportCode || !destinationAirportCode) {
          throw new Error('Airport not found');
        }
  
        const response = await axios.get(apiUrl, {
          auth: {
            username: apiKey,
            password: ''
          },
          params: {
            'segments[0][origin]': originAirportCode,
            'segments[0][destination]': destinationAirportCode,
            'cabin_class': cabinClass,
            'currencies[]': 'USD'
          }
        });
  
        displayResult(response.data, participants);
      } catch (error) {
        console.error('airport translation error', error);
        showErrorBanner();
      }
    }
  
    function showErrorBanner() {
      const errorBanner = document.getElementById('errorBanner');
      errorBanner.style.display = 'block';
    }
  
    function displayResult(data, participants) {
      const resultDiv = document.getElementById('result');
      const totalFootprint = data.footprint * participants;
      resultDiv.innerHTML = `
        <h2>Result:</h2>
        <p>Ecological footprint per passenger: ${data.footprint} kg CO2e</p>
        <p>Total Ecological Footprint per ${participants} passangers: ${totalFootprint} kg CO2e</p>
        <h3>Offset price:</h3>
        <p>${data.offset_prices[0].amount} USD</p>
        <a href="${data.offset_prices[0].offset_url}" target="_blank">Go to offset</a>
      `;
    }
  
    document.getElementById("calculateButton").addEventListener("click", calculateFootprint);
    const destinationInput = document.getElementById('destination');
    destinationInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        calculateFootprint();
      }
    });
    // Counter
    function updateParticipants(value) {
      participants = value;
      document.getElementById('participants').value = participants;
    }
  
    document.getElementById("decrementButton").addEventListener("click", function () {
      if (participants > 1) {
        updateParticipants(participants - 1);
      }
    });
  
    document.getElementById("incrementButton").addEventListener("click", function () {
      updateParticipants(participants + 1);
    });
  
    const container = document.querySelector(".container-2");
    const windowToggle = document.getElementById("toggleCurtain");
  
    container.addEventListener("click", function() {
      windowToggle.checked = !windowToggle.checked;
    });
  });
  
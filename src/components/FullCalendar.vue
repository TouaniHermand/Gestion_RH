<template>
    <div>
      <h2 class="calendar-title">JavaScript FullCalendar 📅</h2>
      <div class="container">
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </template>
  
  <script>
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import listPlugin from '@fullcalendar/list';
  import axios from "axios";
  
  export default {
    components: {
      FullCalendar
    },
    data() {
      return {
        calendarOptions: {
          plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
          initialView: 'dayGridMonth',
          headerToolbar: {
            left: 'prev,today,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          },
          buttonText: {
            today: 'TODAY',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            list: 'List'
          },
          selectable: true,
          events: [] // Initial empty events array
        },
        evenements: null
      };
    },
    methods: {
      // Method to add events dynamically
      addEvent(title, start, color = 'blue', textColor = 'black') {
        this.calendarOptions.events.push({
          title: title,
          start: start,
          end: end,
          color: color,
          textColor: textColor
        });
      },
  
      async index() {
        try {
          const result = await axios.get('http://127.0.0.1:3333/events');
          this.evenements = result.data;
          console.log(this.evenements);
          this.evenements.forEach(event => {
            this.addEvent(`New Event 1`, `${event.date_naissance}T${event.heure}`, '2024-07-08T12:00', 'green');
          });
        } catch (error) {
          console.log(error.response.data);
        }
      }
    },
    mounted() {
      this.index(); // Corrected method call
    }
  };
  </script>
  
  <style scoped>
  .container {
    width: 90%;
    margin: 0 auto;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .calendar-title {
    text-align: center;
    color: #343a40;
    font-size: 24px;
    margin-bottom: 20px;
    font-family: 'Arial', sans-serif;
  }
  
  /* Styles for FullCalendar buttons and events */
  /* ... */
  </style>
  
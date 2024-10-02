<template>
  <div class="container">
    <div class="chart-container">
      <h2>Distribution des employés par département</h2>
      <Bar :data="departementChartData" :options="departementChartOptions" />
    </div>

    <div class="chart-container">
      <h2>Nombre de présences par employé</h2>
      <Bar :data="presenceChartData" :options="presenceChartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const employes = ref([]);
const departements = ref([]);

const fetchDepartements = async () => {
  try {
    const result = await axios.get('http://127.0.0.1:3333/departements', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    departements.value = result.data;
  } catch (error) {
    console.error(error.response.data);
  }
};

const fetchEmployes = async () => {
  try {
    const result = await axios.get('http://127.0.0.1:3333/presences', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    employes.value = result.data;
  } catch (error) {
    console.error(error.response.data);
  }
};

onMounted(() => {
  fetchDepartements();
  fetchEmployes();
});

const departementChartData = computed(() => {
  const data = departements.value.map(departement => {
    const count = employes.value.filter(e => e.departement_id === departement.id).length;
    return { name: departement.nom, count };
  });

  return {
    labels: data.map(d => d.name),
    datasets: [{
      label: 'Employés',
      data: data.map(d => d.count),
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };
});

const departementChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Distribution des employés par département',
    },
  },
};

const presenceChartData = computed(() => {
  const data = employes.value.map(employe => {
    const presenceCount = employe.presences.length;
    return {
      name: `${employe.nom} ${employe.prenom}`,
      count: presenceCount,
    };
  });

  return {
    labels: data.map(d => d.name),
    datasets: [{
      label: 'Presences',
      data: data.map(d => d.count),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };
});

const presenceChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Nombre de présences par employé',
    },
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.chart-container {
  width: 800px; /* Ajustez la largeur selon vos besoins */
  margin: 20px;
}
</style>

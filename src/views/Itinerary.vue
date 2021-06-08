<template>
  <div class="itinerary">
    <h4>This is your itinerary:</h4>

    <table v-if="id && guest">
      <thead>
        <tr>
          <th>Guest ID</th>
          <th>Name</th>
          <th># of Companions</th>
          <th>Package ID</th>
          <th>Seat</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td> {{ guest.id }} </td>
          <td> {{ guest.name }} </td>
          <td> {{ guest.companions }} </td>
          <td> {{ packages[guest.packageId] }} </td>
          <td> {{ guest.seat }} </td>
        </tr>
      </tbody>
    </table>

    <div v-else>
      No guest data was provided
    </div>

    <button role="button" class="back" @click="goback"> Go back </button>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Itinerary',
    props: {
      id: String,
      guest: Object
    },
    computed: {
      ...mapState(['packages']) // package data (key/value pairs) cached from vuex state
    },
    methods: {
      goback() {
        this.$router.push('/')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .itinerary {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  table {
    border-collapse: collapse;
    margin: 0 auto;
    box-shadow: 2px 2px 12px #aaa;

    thead {
      background-color: aquamarine;
    }

    th,
    td {
      padding: 10px 20px;
    }
  }

  button.back {
    margin: 30px 0;
    padding: 5px 10px;
    background-color: cornflowerblue;
    color: white;
    border: 2px solid lightblue;
    border-radius: 5px;

    &:hover {
      cursor: pointer;
      background-color: cornflowerblue;
    }
  }
</style>
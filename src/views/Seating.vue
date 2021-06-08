<template>
  <div class="home">
    <section class="seating">
      <div class="row" v-for="row in seatMap" :key="row.label">
        <div class="seat" v-for="(seat, index) in row.seats" :key="index" :class="{'main-guest': seat.id && !seat.isCompanion}">
          <router-link v-if="seat.id && !seat.isCompanion" :to="{ name: 'itinerary', params: { id: `${seat.id}`, guest: {...seat, seat: `${row.label}${index+1}`} }}">
            {{ seat.id }}
          </router-link>
          <span v-else>{{ seat.id ? seat.id : '' }}</span>
        </div>
      </div>

      <div class="seating-prefs">
        <span>Seating priority strategy: </span>
        <input type="radio" v-model="seatingStrategy" value="0"> RSVP order
        <input type="radio" v-model="seatingStrategy" value="1"> Party size
        <input type="radio" v-model="seatingStrategy" value="2"> Mixed
      </div>

      <button role="button" class="seat-guests" :disabled="generatingData" @click="mockDataAndSeatGuests">
        {{ generatingData ? 'Please wait...' : 'Seat Guests'}}
      </button>
    </section>
  </div>
</template>

<script>
  import createGuestsMixin from '@/mixins/createGuests'
  import seatGuestsMixin from '@/mixins/seatGuests'
  import constants from '@/plugins/constants'

  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  export default {
    name: 'Seating',
    mixins: [
      createGuestsMixin,
      seatGuestsMixin
    ],
    data() {
      let seatArray = []
      for (let i = 0; i < constants.COLUMNS; i++) {
        let row = { label: rowLabels[i], seats: [] }
        for (let j = 0; j < constants.ROWS; j++) {
          row.seats.push({})
        }
        seatArray.push(row)
      }

      return {
        seatMap: seatArray,
        seatingStrategy: '0'
      }
    },
    watch: {
      /* Seating strategy can be changed for an existing set of guests */
      seatingStrategy(val) {
        if (!this.guests.length) return
        if (val === '1') {
          this.guests.sort((a, b) => b.companions - a.companions)
        } else {
          this.guests.sort((a, b) => a.id - b.id)
        }
        this.fillVenue()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @mixin rowLabels {
    @for $i from 1 to 11 {
      &:nth-child(#{$i})::before {
        content: str-slice('ABCDEFGHIJ', $i, $i);
        font-size: 0.9em;
        position: absolute;
        top: 12px;
        left: -15px;
        display: inline-block;
        width: 15px;
        text-align: center;
      }
    }
  }

  @mixin columnLabels {
    @for $i from 1 to 11 {
      &:nth-child(#{$i})::before {
        content: '#{$i}';
        position: absolute;
        top: -15px;
        display: inline-block;
        width: 15px;
        text-align: center;
      }
    }
  }

  button.seat-guests {
    margin: 10px 0;
    padding: 10px;
    background-color: cornflowerblue;
    color: white;
    border: 2px solid lightblue;
    border-radius: 5px;

    &:hover {
      cursor: pointer;
      background-color: cornflowerblue;
    }
  }

  .seating {
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    .row {
      display: flex;
      position: relative;

      @include rowLabels;

      &:first-child .seat {
        @include columnLabels;
      }

      .seat {
        font-size: 0.9em;
        width: 30px;
        height: 30px;
        border: 1px solid lightgrey;
        border-radius: 3px;
        margin: 5px;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
          background-color: lightgrey;
          cursor: default;
        }

        &.main-guest {
          background-color: aquamarine;
          cursor: pointer;
        }
      }
    }
  }

  .seating-prefs {
    margin: 20px;
    font-size: 0.8em;
    background-color: cornflowerblue;
    color: white;
    padding: 10px;
    border: 2px solid lightblue;
    border-radius: 5px;
    user-select: none;

    input {
      margin-left: 10px;
    }
  }
</style>
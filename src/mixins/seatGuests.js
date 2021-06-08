import constants from '@/plugins/constants'

const seatGuestsMixin = {
  data() {
    return {
      guests: [],
      generatingData: false
    }
  },
  methods: {
    /**
     * Finds the first guest in the guests array that fits in the number of free seats given.
     * Uses different search functions depending on the seating priority variable in the component.
     * If it cannot find an exact match it calls itself recursively until it finds a guests or runs out of seats/guests.
     */
    findFirstToFitInRow(guests, leftFree) {
      if (!leftFree) return null

      const prioritizeRsvp = (guest) => guest.companions <= leftFree - 1
      const prioritizeSize = (guest) => guest.companions === leftFree - 1

      let findFn
      if (this.seatingStrategy === '0') findFn = prioritizeRsvp
      else findFn = prioritizeSize

      let firstFit = guests.findIndex(findFn)
      if (firstFit > -1) {
        return guests.splice(firstFit, 1)[0]
      } else return this.findFirstToFitInRow(guests, leftFree - 1)
    },
    /**
     * Fills a row with guests. Starts with the first unseated guest available. Guests in the same party are seated together.
     * Takes into account the number of rowns and seats in the venue. Stops if there are no more unseated guests.
     */
    fillRow(guests) {
      if (!guests.length) return null

      let row = []
      let assigned = 0
      let firstGuest = guests.shift()

      row.push(firstGuest)
      assigned += firstGuest.companions + 1

      while (assigned <= constants.COLUMNS) {
        let guest = this.findFirstToFitInRow(guests, constants.COLUMNS - assigned)
        if (guest) {
          assigned += guest.companions + 1
          row.push(guest)
        } else break
      }

      return row
    },
    /* Returns the number of people occupying a row (a row is an array of guests) */
    peopleInRow(row) {
      return row.reduce((total, guest) => {
        return total + guest.companions + 1
      }, 0)
    },
    /* Calculates the total number of people seated. Used to verify that the venue has been filled. */
    peopleSeated(matrix) {
      let peopleSeated = matrix.reduce((sum, row) => {
        return sum + this.peopleInRow(row)
      }, 0)

      return peopleSeated
    },
    /** Generates guests and starts filling the venue.
     * If party size is prioritized, sorts the array by companions before seating.
     */
    mockDataAndSeatGuests() {
      this.generatingData = true
      this.guests = this.createGuests(constants.GUESTS)
      if (this.seatingStrategy === '1') this.guests.sort((a, b) => b.companions - a.companions)
      this.fillVenue()
    },
    /**
     * Starts filling the venue from first row to last.
     * First it clones the guests array so it can remove each guest that is seated.
     * This allows changing seating strategy on the fly for the same set of gusts.
     *
     */
    fillVenue() {
      let guests = JSON.parse(JSON.stringify(this.guests))

      let totalPeople = this.getPeopleCount(guests)
      let matrix = []

      while (this.peopleSeated(matrix) < constants.ROWS * constants.COLUMNS && matrix.length < 10) {
        let row = this.fillRow(guests)

        if (row != null) {
          matrix.push(row)
        } else break
      }

      // if there are unfilled rows, put them at the back to ensure they are consecutive
      matrix.sort((rowA, rowB) => this.peopleInRow(rowB) - this.peopleInRow(rowA))

      let seatedPeople = this.peopleSeated(matrix)
      let empty = constants.ROWS * constants.COLUMNS - seatedPeople

      // in case there is more than 1 free seat left (which means there are no guests left with 0 companions)
      // it will try to find the first guest that has the correct number of companions to fill those seats
      // for example if 2 seats are left empty it finds the first guest with 1 companion
      // then it seats those 2 people in adjacent rows but in the same column.
      // if, say, 3 individual seats are available, then the first guest + 2 companions are seated
      if (empty > 1) {
        this.displaySeating(matrix)
        let luckyGuest = this.findFirstToFitInRow(guests, empty)

        if (luckyGuest) {
          let unfilledRows = matrix.filter((row) => this.peopleInRow(row) < constants.COLUMNS)

          for (row of unfilledRows) {
            let empty = constants.COLUMNS - this.peopleInRow(row)
            for (let i = 0; i < empty; i++) {
              let person = { ...luckyGuest, companions: 0 }
              row.push(person)
            }
          }

          seatedPeople = peopleSeated(matrix)
          empty = constants.ROWS * constants.COLUMNS - seatedPeople
          this.displaySeating(matrix)
        }
      }

      // now the seating matrix is complete and we copy the guests in the seatingMap (component field) to update display
      for (const [index, row] of matrix.entries()) {
        this.seatMap[index].seats = []
        for (let guest of row) {
          for (let i = 0; i < guest.companions + 1; i++) {
            // companions have custom names and don't get itinerary links
            this.seatMap[index].seats.push(i == 0 ? guest : { id: guest.id, name: `${guest.name}_party`, isCompanion: true })
          }
        }
      }

      console.log('Seating arrangement:\n') // to see seating in console
      this.displaySeating(matrix)
      this.generatingData = false

      // returned object is not used currently but intended to be used in testing the seating algorithm
      return {
        people: totalPeople,
        seated: seatedPeople,
        matrix: matrix,
        guests: guests
      }
    },
    // display a 2D matrix of guest ids arranged according to their seats (for use in console)
    displaySeating(matrix) {
      let output = ''
      for (let row of matrix) {
        let seating = ''
        for (let guest of row) {
          for (let i = 0; i < guest.companions + 1; i++) {
            seating += `${guest.id < 10 ? ' ' : ''}${guest.id} `
          }
        }
        output += seating += '\n'
      }
      console.log(output)
    }
  }
}

export default seatGuestsMixin

const createGuestsMixin = {
  methods: {
    /* Creates a random integer in the given range */
    createInRange(min, max) {
      return Math.floor(Math.random() * (max + 1 - min)) + min
    },
    /* Convenience method to check that all integers in an array are all between a min and a max */
    validateAllInRange(values, min, max) {
      for (let i = 0; i < values.length; i++) {
        if (values[i] < min || values[i] > max) return false
      }
      return true
    },
    /* Creates an array of guests having ordered ids and a random number of companions (0..5) */
    createGuests(count) {
      let guests = []
      for (let i = 1; i <= count; i++) {
        let guest = {
          id: i,
          name: `Guest_${i}`,
          companions: this.createInRange(0, 5),
          packageId: this.createInRange(1, 5)
        }
        guests.push(guest)
      }
      return guests
    },
    /* Convenience method to check the distribution of generated values for a set number of keys */
    getDistribution(values) {
      return (summary = values.reduce((total, val) => {
        if (!total[val]) total[val] = 0
        total[val]++
        return total
      }, {}))
    },
    /* Calculates the number of people (guests + their companions) in an array of guests */
    getPeopleCount(guests) {
      return guests.reduce((sum, guest) => {
        return sum + guest.companions + 1
      }, 0)
    },
    /* Convenience method to test that the number of generated guests and companions (as well as package ids) are valid */
    verifyGuestData(guests) {
      let packageIds = guests.map((g) => g.packageId)
      let companions = guests.map((g) => g.companions)
      let packagesValid = this.validateAllInRange(packageIds, 1, 5)
      let companionsValid = this.validateAllInRange(companions, 0, 5)
      return { packagesValid, companionsValid }
    }
  }
}

export default createGuestsMixin

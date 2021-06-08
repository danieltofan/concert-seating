const createInRange = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min

const validateAllInRange = (values, min, max) => {
  for (let i = 0; i < values.length; i++) {
    if (values[i] < min || values[i] > max) return false
  }
  return true
}

const getDistribution = (values) => {
  return (summary = values.reduce((total, val) => {
    if (!total[val]) total[val] = 0
    total[val]++
    return total
  }, {}))
}

const createPackageIds = (count, min, max) => {
  let vals = []
  for (let i = 0; i < count; i++) {
    vals.push(createInRange(min, max))
  }
  return vals
}

const createGuests = (count, sortByPartySize) => {
  let guests = []
  for (let i = 1; i <= count; i++) {
    let guest = {
      id: i,
      name: `Guest ${i}`,
      companions: createInRange(0, 5),
      packageId: createInRange(1, 5)
    }
    guests.push(guest)
  }
  return sortByPartySize ? guests.sort((a, b) => b.companions - a.companions) : guests
}

const getPeopleCount = (guests) => {
  return guests.reduce((sum, guest) => {
    return sum + guest.companions + 1
  }, 0)
}

const verifyGuestData = (guests) => {
  let packageIds = guests.map((g) => g.packageId)
  let companions = guests.map((g) => g.companions)
  let packagesValid = validateAllInRange(packageIds, 1, 5)
  let companionsValid = validateAllInRange(companions, 0, 5)
  if (LOGGING) {
    console.log('All packages Valid', packagesValid)
    console.log('All companions Valid', companionsValid)
  }
}

const findFirstToFitInRow = (guests, leftFree) => {
  if (!leftFree) return null
  let firstFit = guests.findIndex((guest) => guest.companions === leftFree - 1)
  if (firstFit > -1) {
    return guests.splice(firstFit, 1)[0]
  } else return findFirstToFitInRow(guests, leftFree - 1)
}

const fillRow = (guests) => {
  if (!guests.length) return null

  let row = []
  let assigned = 0
  let firstGuest = guests.shift()

  row.push(firstGuest)
  assigned += firstGuest.companions + 1

  while (assigned <= COLUMNS) {
    let guest = findFirstToFitInRow(guests, COLUMNS - assigned)
    if (guest) {
      assigned += guest.companions + 1
      row.push(guest)
    } else break
  }

  return row
}

const peopleInRow = (row) =>
  row.reduce((total, guest) => {
    return total + guest.companions + 1
  }, 0)

const peopleSeated = (matrix) => {
  let peopleSeated = matrix.reduce((sum, row) => {
    return sum + peopleInRow(row)
  }, 0)

  return peopleSeated
}

const displaySeating = (matrix) => {
  for (let row of matrix) {
    let seating = ''
    for (let guest of row) {
      for (let i = 0; i < guest.companions + 1; i++) {
        seating += `${guest.id < 10 ? ' ' : ''}${guest.id} `
      }
    }
    console.log(seating)
  }
}

const fillVenue = (sortByPartySize = true, test = false) => {
  let guests = createGuests(GUESTS, sortByPartySize)
  let totalPeople = getPeopleCount(guests)
  let distribution = getDistribution(guests.map((g) => g.companions + 1))

  if (LOGGING) console.log(guests)
  if (LOGGING) console.log('Total people', getPeopleCount(guests))

  let matrix = []
  while (peopleSeated(matrix) < ROWS * COLUMNS && matrix.length < 10) {
    let row = fillRow(guests)

    if (row != null) {
      matrix.push(row)
    } else break
  }

  matrix.sort((rowA, rowB) => peopleInRow(rowB) - peopleInRow(rowA))

  if (LOGGING) {
    console.log('Seating chart:')
    displaySeating(matrix)
  }

  let seatedPeople = peopleSeated(matrix)
  let empty = ROWS * COLUMNS - seatedPeople

  if (empty > 1) {
    console.log('\nUnfilled venue:')
    displaySeating(matrix)
    console.log('\ntrying to fill the last', empty, 'seat(s)')

    let potentialGuests = guests.filter((g) => g.companions === empty - 1).length
    console.log('Possible guests left with', empty - 1, 'companions:', potentialGuests)
    let luckyGuest = findFirstToFitInRow(guests, empty)

    if (luckyGuest) {
      console.log('Found lucky guest', luckyGuest)
      let unfilledRows = matrix.filter((row) => peopleInRow(row) < COLUMNS)

      for (row of unfilledRows) {
        let empty = COLUMNS - peopleInRow(row)
        for (let i = 0; i < empty; i++) {
          let person = { ...luckyGuest, companions: 0 /*, name: `${luckyGuest.name} party`*/ }
          row.push(person)
        }
      }

      seatedPeople = peopleSeated(matrix)
      empty = ROWS * COLUMNS - seatedPeople
      console.log('\nAfter filling we have', empty, 'empty seat(s) left, see matrix below')
      displaySeating(matrix)
    }

    console.log('\n------------\n')
  }

  if (LOGGING) {
    console.log('\nTotal seated people:', seatedPeople)
    console.log('Total unseated people:', totalPeople - seatedPeople)
  }

  if (test) {
    verifyGuestData(guests)
    stressTestPackageIds()
    LOGGING = false
    stressTestSeating()
  }

  return {
    people: totalPeople,
    seated: seatedPeople,
    matrix,
    guests
  }
}

const stressTestPackageIds = () => {
  let testPackages = createPackageIds(MAX_TESTS, 0, 5)
  let valid = validateAllInRange(testPackages, 0, 5)
  if (LOGGING) {
    console.log('\n', MAX_TESTS, 'package ids valid', valid)
    console.log('Package ID distribution:', getDistribution(testPackages))
  }
}

const stressTestSeating = () => {
  let peopleCountsInvalid = 0
  let allSeatsNotFilled = 0
  let unfilledVenue = []

  for (let i = 0; i < MAX_TESTS; i++) {
    let { people, seated, matrix, guests } = fillVenue(false, false)
    if (people < GUESTS || people > GUESTS * 6) peopleCountsInvalid++
    if (seated !== ROWS * COLUMNS) {
      allSeatsNotFilled++
      unfilledVenue.push(seated)
    }
  }

  console.log('\nIn', MAX_TESTS, 'runs people counts were invalid', peopleCountsInvalid, 'time(s)')
  console.log('In', MAX_TESTS, 'runs all seats were not filled', allSeatsNotFilled, 'time(s)', `(${((allSeatsNotFilled * 100) / MAX_TESTS).toFixed(4)}%)`)
  if (allSeatsNotFilled) console.log('Occupancy in unfilled cases', getDistribution(unfilledVenue))
}

const MAX_TESTS = 100000
const COLUMNS = 10
const ROWS = 10
const GUESTS = 100
let LOGGING = false
fillVenue(false, true)

# concert-seating

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

If a browser window is not opened by default, open one and navigate to
`http://localhost:8080/`

### Builds dist folder for production

```
npm run build
```

## Implementation details

When the app starts, the home page displays an empty "venue section" with 10 rows of 10 seats each, labeled accordingly.
Click the 'Seat Guests" button at the bottom of the page to generate mock guest data and seat them.

Notice that there is a "seating strategy" radio group that allows you to seat guests based on 3 strategies:

- Prioritize RSVP order: this algorightm will seat guests based on their id order as much as possible, while filling every row; if the "next guest" on the list plus their companions do not fit in the remaining empty seats of the current row, the first guest in line that has the correct number of companions (available seats - 1) is seated next, then return to the next in line and so on
- Prioritize party size: give priority to the guests who bought the most tickets: this means that guests with 5 companions (6 people total) are seated first, and to fill each row they are always matched with guests that have 3 companions (4 people) until we run out of either, then we match based on who fits in the space available, and so on
- Mixed priority: just for fun, we start with the first party on the list, then put a big party right next to them, then we complete the row if needed with the next fits, then the next on the list goes in row B and so on, mixing and matching id (RSVP) order with party size

Changing the priority order in the controls simply rearranges the existing set of guests, and you can see that in the display.
If you want a new set of guests, click "Seat Guests" again. When the new mock guests are seated, the currently selected seating priority option dictates how they get seated. I added these options for fun and to give the problem a little twist.

The app is extremely fast and responsive. I implemented a strategy to disable the generate button and display a message but it will never be seen (I can't see it) because the code runs very fast. No transitions were needed at all, both pages display instantly.

I placed the "Seat Guests" at the bottom of the page in order to make the seating strategy options visible and imply that the value chosen there affects the new seating.

### Seating algorithm

As required, there are enough guests generated to fill the 10 x 10 venue. In all strategies described above, guests are seated next to their companions and each row is filled before the next row starts to fill. This is repeated until we run out of seats.

There can be a rare case when a seat or two might be left unoccupied because there is no guest with the required number of companions left unseated (more on this below).
If 1 seat is left unoccupied it is always because there was no guest left without companions. If 2 seats are left, then we find the first lucky guest+1 and we seat those two people in adjacent rows. We make the rows adjacent simply by sorting them by occupancy. These lucky guests will always be seated in the last rows, but their party will occupy the same column, so still good. Of course, this sorting of rows is arbitrary just for the purpose of grouping unfilled rows together. This could be done several different ways.

## Guest itinerary page

As per requirements, each filled seat displays the ID of the primary guest and their companion seats display the same ID.
You will notice that the "main" guests have a light green background in the seating map while their companions do not.
That is because only the main guest gets to go to the Itinerary and see his/her details. Those seats are thus clickable, while the companions' seats are not.

Clicking on a main guest seat loads the Itinerary page which displays the guest data as per requirements.

### Caching package data

This PoC is extemely simple and makes no HTTP requests. To implement the caching requirement I simply used Vuex. As a data store, Vuex will keep common data in its state. There are caching packages built on top of Vuex, as well as more complex caching library as mentioned in the doc, but none of those are needed for this PoC. The package data is stored as a key/value map as requested in the Vuex state, and the component loads that state and simply accesses the package id to get its value.

Had this been a real app where HTTP request are made to an API in order to read guest and package data, a more appropriate caching library would be used. Also, the Vuex store would have actions and mutations to read/write data. None of that is necessary here.

### Testing

I started the project by writing all the functions in a .js file that could be run in Node. That way, I could test the seating algorithm and the validity of data by running the functions many times and checking the results. I will include some sample test runs here to illustrate the validity of this project.

I did not have time to add Jest tests for the components themselves, but I am providing the manual tests that I used to validate the data and the algorithms (details below).

#### Generate 10 guests and seat them

PS C:\Code\Demos> node seats.js

```
[
  { id: 6, name: 'Guest 6', companions: 5, packageId: 5 },
  { id: 1, name: 'Guest 1', companions: 4, packageId: 4 },
  { id: 3, name: 'Guest 3', companions: 4, packageId: 1 },
  { id: 8, name: 'Guest 8', companions: 4, packageId: 2 },
  { id: 10, name: 'Guest 10', companions: 4, packageId: 5 },
  { id: 7, name: 'Guest 7', companions: 3, packageId: 4 },
  { id: 9, name: 'Guest 9', companions: 3, packageId: 4 },
  { id: 2, name: 'Guest 2', companions: 2, packageId: 1 },
  { id: 4, name: 'Guest 4', companions: 1, packageId: 5 },
  { id: 5, name: 'Guest 5', companions: 0, packageId: 2 }
]
```

The above is the mock data for 10 random guests, for a total of 40 people including companions.

Below are some details into how the seating algorithm works - for each row, it displays who was seated where.

```
Total people 40
All packages Valid true
All companions Valid true
peopleSeated 0

filled row [
  { id: 6, name: 'Guest 6', companions: 5, packageId: 5 },
  { id: 7, name: 'Guest 7', companions: 3, packageId: 4 }
]
peopleSeated 10

filled row [
  { id: 1, name: 'Guest 1', companions: 4, packageId: 4 },
  { id: 3, name: 'Guest 3', companions: 4, packageId: 1 }
]

peopleSeated 20
filled row [
  { id: 8, name: 'Guest 8', companions: 4, packageId: 2 },
  { id: 10, name: 'Guest 10', companions: 4, packageId: 5 }
]

peopleSeated 30
filled row [
  { id: 9, name: 'Guest 9', companions: 3, packageId: 4 },
  { id: 2, name: 'Guest 2', companions: 2, packageId: 1 },
  { id: 4, name: 'Guest 4', companions: 1, packageId: 5 },
  { id: 5, name: 'Guest 5', companions: 0, packageId: 2 }
]
peopleSeated 40

Matrix [
  [
    { id: 6, name: 'Guest 6', companions: 5, packageId: 5 },
    { id: 7, name: 'Guest 7', companions: 3, packageId: 4 }
  ],
  [
    { id: 1, name: 'Guest 1', companions: 4, packageId: 4 },
    { id: 3, name: 'Guest 3', companions: 4, packageId: 1 }
  ],
  [
    { id: 8, name: 'Guest 8', companions: 4, packageId: 2 },
    { id: 10, name: 'Guest 10', companions: 4, packageId: 5 }
  ],
  [
    { id: 9, name: 'Guest 9', companions: 3, packageId: 4 },
    { id: 2, name: 'Guest 2', companions: 2, packageId: 1 },
    { id: 4, name: 'Guest 4', companions: 1, packageId: 5 },
    { id: 5, name: 'Guest 5', companions: 0, packageId: 2 }
  ]
]

Seating chart:
 6  6  6  6  6  6  7  7  7  7
 1  1  1  1  1  3  3  3  3  3
 8  8  8  8  8 10 10 10 10 10
 9  9  9  9  2  2  2  4  4  5

Total seated people: 40
Total unseated people: 0
```

The above run seated gusts by party size first.

In another sample run (with 100 guests), and using the RSVP-first strategy, 3 seats were left empty.
The backfill algorithm kicked in and filled those seats.

```
Unfilled venue:
 1  1  1  3  3  3  3  3  3  6
 2  2  8  8  8  8  8  8  7  7
 4  4  4  9  9  9  9  9  9 11
 5  5  5 13 13 13 13 13 13 14
10 10 10 15 15 15 15 15 15 62
12 12 12 20 20 20 20 20 20 85
17 17 17 17 33 33 33 33 33 33
16 16 16 23 23 23 23 23 23
18 18 18 34 34 34 34 34 34
19 19 19 37 37 37 37 37 37

trying to fill the last 3 seats
Possible guests left with 2 companions: 22
Found lucky guest { id: 21, name: 'Guest 21', companions: 2, packageId: 2 }

After filling we have 0 empty seats left, see below
 1  1  1  3  3  3  3  3  3  6
 2  2  8  8  8  8  8  8  7  7
 4  4  4  9  9  9  9  9  9 11
 5  5  5 13 13 13 13 13 13 14
10 10 10 15 15 15 15 15 15 62
12 12 12 20 20 20 20 20 20 85
17 17 17 17 33 33 33 33 33 33
16 16 16 23 23 23 23 23 23 21
18 18 18 34 34 34 34 34 34 21
19 19 19 37 37 37 37 37 37 21
```

#### Stress tests

I ran the seating algorightm millions of times in order to get a sense of "failure" rate. Below are results with 100, 150, 200 guests, each set being tested 1 million times.

```
100 guests:
In 1000000 runs people counts were invalid 0 time(s)
In 1000000 runs all seats were not filled 38 time(s) (0.0038%)
Occupancy in unfilled cases { '99': 38 }

150 guests:
In 1000000 runs people counts were invalid 0 time(s)
In 1000000 runs all seats were not filled 0 time(s) (0.0000%)

200 guests:
In 1000000 runs people counts were invalid 0 time(s)
In 1000000 runs all seats were not filled 0 time(s) (0.0000%)
```

For 100 guests, the venue did not get filled only about 0.004% of times (1 million runs), and in every occurance only 1 seat was left unoccupied. Having no more guests with no companions, that seat cannot be filled. Of course, the results above will change because data is random.

In the Vue app, I used 200 guests to be sure that no matter how many times you click on the buttons, all guests are seated.

The Node.js version of the app that contains all the functions needed (and a few convenience ones) is in the file named seating.js. Feel free to run tests at will by opening a node terminal and running this command in the project root folder:

```
node src/plugins/seating.js
```

Most constants are at the bottom of the file, change them accordingly for each test run.

### Vue version

I used Vue 2 (with Javascript) and not the Typescript version for simplicity, and because I am a lot more familiar with it.
Vue 3 could be used just as well and the differences would be relatively minor. Last time I checked (in October) the Vue ecosystem tooling was lagging behind in its support for Vue 3 and Typescript. This has probably improved by now.

### Dev tools

You can inspect the component fields in Vue dev tools for both Seating and itinerary components.

# neds_techical_task

This project is an demonstration of Neds Next to Go Races, using Vuex and VueJS

## Special Considerations

## To run the Neds Technical Task

```
yarn install
```

### For a quick demostration run the following command

```
yarn serve --port 80
```

## To DO

Create Unit Tests
Implements checks for slow or non responsive network

## Possible improvements

**Story Question**

The task stated that the user should see 5 races at all times, however I was unsure whether or not 5 races should have been visibile for each filtered category.

**Network connection checks and limiting calls**

I did implement a small check to make sure that if a call was made inside of 10 seconds that another was not sent, due to some races finishing at the same time.

**Improve Layout Design**

**Common shared time**
Improvements on timestamps used in the system, as a risk is local time could be incorrect.

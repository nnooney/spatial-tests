# Spatial Belief and Ability in Practical Applications

Nick Nooney, 5 April 2016

# Project Description

This site collects data on people's relationship between their belief about
their own spatial ability and their performance on a number of given tasks. The
data collected is stored in the browser's *localStorage* module and then
submitted at the end of the information collection session.

# The Data

The following data is collected for each user:

- Background information filled out by a survey
- Performance on 4 tests:
    - Mental Rotation Test
    - Placing Buildings on a Map
    - Tracing a Route from a Story
    - Identifying Location from Surroundings
- A Post-Test Review

## Exactly What Data is stored?

When you create a participant ID, the key will be stored in order to associate
your data together, so that you will be able to access it later. Below is an
example of the possible data for participant ABCDE:

```
ABCDE.pre.completed = T/F
ABCDE.pre.directions = 0..5
ABCDE.pre.years = 0..5
ABCDE.pre.course = 0..5
ABCDE.pre.building = building
ABCDE.pre.gender = M/F/C
ABCDE.pre.role.<type> = T/F

ABCDE.mrt.completed = T/F
ABCDE.mrt.order = The order the trials were shown
ABCDE.mrt.#.guess = F/J
ABCDE.mrt.#.actual = F/J
ABCDR.mrt.#.time = Time to Answer

ABCDE.bldg.completed = T/F
ABCDE.bldg.order = The order the trials were shown
ABCDE.bldg.#.guess.rot = 0..7 (Actual is always 0)
ABCDE.bldg.#.guess.x = #
ABCDE.bldg.#.guess.y = #
ABCDE.bldg.#.actual.x = #
ABCDE.bldg.#.actual.y = #
ABCDE.bldg.#.time = Time to Complete Task

ABCDE.stry.completed = T/F
ABCDE.stry.#.guess.path = <PATH>
ABCDE.stry.#.actual.path = <PATH>
ABCDE.stry.#.readTime = Time to Read Story
ABCDE.stry.#.drawTime = Time to Trace Path

ABCDE.img.completed = T/F
ABCDE.img.#.answer = Text
ABCDE.img.#.question = Text
ABCDE.img.#.time = Time to choose answer

ABCDE.post.completed = T/F
ABCDE.post.easy = mrt/bldg/stry/img
ABCDE.post.hard = mrt/bldg/stry/img
ABCDE.post.skill = +/-/0
```

None of the data is identifiable back to an individual.

# Flow of the Application

The user will see the following screens in order:

1. Title Screen
2. Signup / Login^ Screen
3. Background Survey
4. List of Tasks
5. Description of Test 1
6. Test 1: Mental Rotation Test
7. Description of Test 2
8. Test 2: Placing Buildings on a Map
9. Description of Test 3
10. Test 3: Tracing a Route from a Story
11. Description of Test 4
12. Test 4: Identifying Location from Surroundings
13. All Tests Finished
14. Post Test Survey
15. Results Summary

^If a user is logging in, then they will see their results screen

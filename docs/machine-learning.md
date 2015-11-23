What's the idea?

A virtual assistent that automatically runs through various test
cases with very little assistence. Basically just like rainforestQA without the humans. All praise the almighty robots!

#### Challenges

- computer vision. Automatically finding stuff like login buttons
- touch gestures & human motion
- UX-specific issues

#### How awesome?

- Timeless. Works with any device since it leverages computer vision.

#### Solutions

- automated assistent that helps with flows and suggestions
- gets smarter each time someone creates a flow
- come up with a flow automatically and let humans modify it.

#### Research

- checkout different apps and figure out common flows

#### How does this line up with BrowserTap?

- infastructure in place for launching any app. Just need a robo agent.
- could be its own product (probably should be)


#### Rambling

- Ability to recursively identify patterns in how it understands what bugs might be in a particular instance. Needs to also pay attention to multiple false positives & false negatives - possibly identifier for a flakey part of the system.
- Should display notice warnings for any visual differences
- Should be able to spin up an infinite amount of workers for tasks
- Should test speeds, email clients, screen resolutions
- Confidence score of according to a particular task. If it fails, then move onto the next item. Otherwise throw an error. If a route has been picked, then use that next time. If it fails next time then re-start then go back to #1.
- Should be able to identify various shapes and attach metadata about them - descriptors of what they mean. This also applies to text. Text in itself should not be keyed up against a database, but instead keyed based on what it *looks* like. This is important especially for mispelled inforation.
- location of any text element should take into consideration other contexts such as language.


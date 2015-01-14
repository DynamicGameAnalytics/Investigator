#Investigator
###investigate your players' tracks
by Lukas Höppner and Gregor Čepin for Design of Dynamic Web Systems at the Technical University of Luleå.

* http://investigator.meteor.com/
* https://github.com/DynamicGameAnalytics/Investigator

##Introduction
*Investigator* is a tool to collect and visualize player data for games. It can be used to get realtime information about player activity for multiple games and analyze this data later on. 
Main users of the app are game developers, who can add little code to their game to send data to our app. It can be used for tracking games written in JavaScript for which we provide direct code to include, or in any other language that supports sending GET and POST requests. When developers want to track a new game, he can create new game in our app and he gets game token. When his game later sends data to our app it is recognized by that token. Every time game sends some data, it has to include type of game event that occurred. Game developer can then watch graph showing game events in real time. He can set different time spans for graph, from showing events just for last minute, for last day, for last week, for last month to showing events for whole last year. Similarly user can set different auto-update times, from updating each second to updating only once per hour. He can choose how densely data is grouped, depending if he wants very precis graph or if he is interested only in overall trends. 
Because game developers are quite often working in teams of few or more people, there are different option for game developer to share data about game with other users. Originally the only user who can access specific game page is user who created the game in our app. Only when he is logged in he can see the graphs. One option for sharing is to enable game page being accesed by all logged in users who have link to the page. Game developer can then send link to everyone he wants. Second option is to make game public for everyone, so every user can see it on his frontpage under section Public games. That type of sharing is probably most appropriate for open sourced games, which have nothing to hide, all users may discover new popular games and maybe even start contributing to the project. Third type of sharing is sharing by username or user email and is most appropriate for teams that strictly don't want data to get public, as may happen by sharing with link. User can find other users by starting typing their credentials in input field and auto-complete form returns matching users for faster input. Users who have access to the game page are listed at the bottom on the page and can be later removed from sharing. Users who game was shared to can see the game listed on their front page under section Shared games. The only user who can edit game sharing options is original user, users who game was shared to can not make changes to sharing settings. For easier recognition of the game user can upload game image, which is used on the front page next to each game and at the top of game page.
New users can either create new account by providing their email and password, or they can use one of the following services for authentication: Google+, Facebook, Twitter and GitHub.
Administrators of our app can check all the data in Admin interface.

##Features
* Creation of different games
* Multiple sessions for each game
* Simple event triggering via RESTful HTTP api
* Easy installation thanks to meteor
* Admin interface with access to raw data
* MongoDB storage
* HTML5 frontend with realtime updates
* Login via Password, Google+, Facebook, Twitter or GitHub

##Installation instructions

Inspector is based on meteor, which can be found at https://www.meteor.com/. Meteor requires OS X or Linux.
After installing meteor and checking out the repository, just run `meteor run` from the repository root directory. This will start the application at http://localhost:3000.

##Technology
Investigator uses meteor with some extra packages.
* **CollectionFS**: binary file uploads and storage
* **Meteor-Bower**: automatically installing bower packages
* **Houston**: drop-in admin interface
* **Autoform**: quick form generation
* **Iron-Router**: application routing with browser history handling
* **Meteor-Collection2**: collection schemes and validation

The frontend is based on **web components** and the **Polymer project**.

##Application design
###Models
The application is based on three main models: Games, Sessions and Events.

Games are the first layer of separation between different groups of data. Games can be shared between users to give other developers access to the data for reading and writing. Every game has a unique token which is used to create sessions for this game.

Sessions are the second layer of separation between different groups of data. Sessions are used to assign events to a specific user (or a *session* of a user) to be able to track sequences of events for this user. With this sequence of events it is possible to analyze in which order the events occured. Every session has a unique session token which is used to trigger events for this session.

Events are the main data instances. Every belongs to a session, has a type, a creation timestamp and may have some extra data. The event types can be different from game to game, so every game can define its own set of possible events by simply sending different type-strings when an event occurs. Events can be sent via a simple HTTP-api from every internet-enabled game or device.

##Security aspects

The collected data is only readable for the owner to keep the privacy, but to be able to trigger events from every device via the HTTP api, this api has to be open for everyone. It would be possible to generate a secret for each game that is required to trigger events, but due to reverse engineering and network traffic analysis, it is impossible to keep that secret secret. It is still necessary to ship the game token with the game and if an attacker gets hands on this token, he can still access every api method, but he has to generate a new session and this session keeps the attacker in a relatively small area of possible damage. If an corrupted session is found, it can simply be deleted or ignored from the analysis. However, the value of an attack on this kind of systems is very low to non-existing.

##Known Problems
Two major problems occured during the development. The first one is meteor itself. Meteor itself is really great and does a lot of things for you, but it also does hide a lot of things. You can use bower for example, but if you do so it is not possible to host the application on the meteor server, because it only runs `meteor run` and this doesn't install the bower packages. So you need to install a package for meteor that installs the bower packages, but if the newest version of the package in the meteor package repository is to old, it is really hard to install a newer version of it via git. We solved this by adding a submodule of a fixed fork of the package to our repository and use this version instead. All in all there is an additional layer between the original package (like bower) and your application and this layer has to be updated which causes another delay in the development circle.

The second major problem are cross-origin requests to the api from a browser and PUT data in these requests. When using a third-party api client like *Postman* for the requests everything works fine, but as soon as this requests are sent by a browser, the message body doesn't get parsed. And, again, you don't know why, because meteor and its packages handle the raw request. As a temporary workaround, the application offers an additional GET method for triggering events, but this method lacks the possibility of providing additional event data.

##Future work
Currently there is only one realtime graph to display all events, but it is possible to add additional graphs like a sankey diagram to visualize player *movements* or other graphs for further data analysis.

In addition to tracking game events, a model for tracking game errors is prepared and may be implemented in the future to make it possible to track game crashes and scripting errors and maybe automatically creating bug reports.

Furthermore there is much space for analysis improvements, such as different event filters and reports simmilar to Google Analytics.

##API documentation

####Get session token
`GET /session_token/:game_token`: Generates a new session token for the given game and replies with
```json
{
  "session_token": session_token
}
```

####Trigger event
`GET /event/:session_token/:event_type`: Triggers a event with the given type for the given session and replies with
```json
{
  "game": game_token,
  "session": session_token,
  "event": {
    "type": event_type
  }
}
```

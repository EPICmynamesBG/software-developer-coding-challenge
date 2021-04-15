# Software Developer Coding Challenge

This is a coding challenge for software developer applicants applying through http://work.traderev.com/

## Goal:

#### You have been tasked with building a simple online car auction system which will allow users to bid on cars for sale and with the following funcitionalies: 

  - [x] Fork this repo. Keep it public until we have been able to review it.
  - [x] A simple auction bidding system
  - [x] Record a user's bid on a car
  - [x] Get the current winning bid for a car
  - [x] Get a car's bidding history 

 ### Bonus:

  - [x] Unit Tests on the above functions
  - [x] Develop a UI on web or mobile or CLI to showcase the above functionality

## Evaluation:

 - [x] Solution compiles. Provide a README to run/build the project and explain anything that you leave aside
    - see SETUP.md
 - [ ] No crashes, bugs, compiler warnings
    - no known bugs or compiler warnings. however, known warnings are:
      - on the backend, a dependency is generating a circular dependency warning
      - in the UI, React is generating hook warnings. Given more time, I would prefer to restructure things to resolve these, but the "recommended" solution actually creates bugs, so these were intentionally left alone for now.
 - [x] App operates as intended
 - [x] Conforms to SOLID principles
    - I believe the backend does this
 - [x] Code is easily understood and communicative
 - [ ] Commit history is consistent, easy to follow and understand
    - starting a project from scratch tends to make my commit patterns and work more scattered vs working in an ongoing build. Towards the end my commits became smaller and more alike that which I usually do, but first half of the project commits are definitely messy. 


-------------
-------------
# System Design

Implementing within Docker for easier launch flow. Additionally provides simpler scalability in dev environment when additional services are added.

### Docker Services
- postgres
  - database; app dependency
  - setup guide provided for initializing database and schema
- api
  - provides the API service and endpoint docs
  - has "extra" features like file upload/storage and NHTSA VIN lookup/decoding
- ui
  - provides the react ui. features dev hot reloading
- cron
  - check and update/manage listing states (active, complete)

## Backend

~Leveraging Sails.js framework for NodeJS for accelerated development, and passport.js for user profile managment.~
This initial intent was scrapped in favor of a framework I had pre-developed for another personal project that leveraged swagger+express and a home built JWT auth solution. 


### Architecture/Schema

users|
:----
id|
username/email|
password|
created_at=now()|
reset_token|

user_listings|
:----
id|
user_id|
vehicle_vin|
display_info|
vehicle_nhtsa_info|
created_at=now()|
start_at_timestamp=now()|
end_at_timestamp|
is_active=FALSE|
is_complete=FALSE|

user_bid|
:----
id|
user_id|
user_listing_id|
created_at=now()|
bid_value|
currency=USD|


### Core Services
- User Authentication
    - basic User Profile creation
    - JWT
- Vehicle Listing Creation/Management
    - Create a listing
      - Supply arbitrary info
      - Define starting bid and end date
- Active Listing
  - User bidding (latest bid must exceed most recent winning bid)
  - Render active/completed and winning user/price
- Unit Testing
- Endpoint Testing (for customized endpoints)

### Stretch Goals:
- Leverage websockets/pub-sub pattern for listings to auto-update UI as bids flow in
- VIN validation/decoding service

### Nice to Haves and Features that will not be completed
- User Authentication
    - Third party auth integration ie: Google, Facebook
    - Forgot Password and Account Delete
- User Notification System
    - In-app and email notifications for bid/listing activity to subscribed user(s)
- Vehicle Listing Creation/Management
  - Attach files
    - Remote Secure File Storage
      - Ideally a solution like S3 is leveraged for file storing and supports more than photos
  - cancel/delete
- VIN validation/decoding service
  - Leverage third party service to perform lookups
  - Auto-supply available vehicle info
  - No DB storage, Redis/in memory only
- Event Driven Bidding System
    - Active UI updates as bids flow in. This could be implemented using web sockets.
- Currency Management/Translation
    - Automatically convert bids from one currency to a common system chosen currency
    - User preference: currency
- Application Metrics & Monitoring

### Shortcomings of this solution
#### Scalability
For a bare-bones application, the above behaviors should function as a suitable proof-of-concept application, but in a real world scenario, the app would likely fall over in the case of a many active bids. In such a scenario, a more Event driven system might work more effectively. One such scalable solution might be to stop tracking all user bids (events) in the database, but instead use something like Kinesis stream to capture the events, with a listener to push them into a Datalake or more flexible data store (ie: elastic search). Thus, we can move our bid queries to look into Elasticsearch (or the end result of whichever pattern is chosen).  This would prevent issues with any Relational DB like Postgres from being clobbered with read/write ops as well as massive data size in that table.

Depending on the expected scale and goals of the user notification system, it’s possible a basic job queue could need implemented (ie: AWS SQS) - primarily for email processing. For real-time in-app notifications, a web socket could be leveraged.



## User Experience - React

Mobile-first design
 - for simplicity and speed, leveraging `react-create-app` and `materialize-css`


### Pages
#### Unauthenticated
- Login
- Sign up
- Market Listings (active listings only)
  - Listing Details
    - bid history

### Authenticated
- My Listings
  - view all user owned listings regardless of status
- Create Listing
  - File Upload
  - VIN Decode/lookup
  - general listing info
- Listing Detail Page
  - post a Bid

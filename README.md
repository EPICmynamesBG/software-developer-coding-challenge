# Software Developer Coding Challenge

This is a coding challenge for software developer applicants applying through http://work.traderev.com/

## Goal:

#### You have been tasked with building a simple online car auction system which will allow users to bid on cars for sale and with the following funcitionalies: 

  - [ ] Fork this repo. Keep it public until we have been able to review it.
  - [ ] A simple auction bidding system
  - [ ] Record a user's bid on a car
  - [ ] Get the current winning bid for a car
  - [ ] Get a car's bidding history 

 ### Bonus:

  - [ ] Unit Tests on the above functions
  - [ ] Develop a UI on web or mobile or CLI to showcase the above functionality

## Evaluation:

 - [ ] Solution compiles. Provide a README to run/build the project and explain anything that you leave aside
 - [ ] No crashes, bugs, compiler warnings
 - [ ] App operates as intended
 - [ ] Conforms to SOLID principles
 - [ ] Code is easily understood and communicative
 - [ ] Commit history is consistent, easy to follow and understand

-------------
-------------
# System Design

Implementing within Docker for easier launch flow. Additionally provides simpler scalability in dev environment when additional services are added.

## Backend

Levaging Sails.js framework for NodeJS for accelerated development, and passport.js for user profile managment. 

### Architecture/Schema

users|
:----
id|
username/email|
password|
created_at_timestamp=now()|
reset_token|

vehicles|
:----
vin|

user_listings|
:----
id|
user_id|
vehicle_vin|
created_at_timestamp=now()|
start_at_timestamp=now()|
start_at_price=0|
end_date|
is_active=FALSE|
is_complete=FALSE|
winning_bid_id=NULL|

vehicle_photos|
:----
id|
storage_path|
mime_type|
file_ending|
created_at_timestamp=now()|
created_by_user_id|
vehicle_vin|
user_listing_id|

user_bid|
:----
id|
user_id|
user_listing_id|
created_at_timestamp|
bid_value|
currency=USD|


### Core Services
- User Authentication
    - basic User Profile creation
    - JWT
- Vehicle Listing Creation/Management
    - Create a listing
        - Attach photos and arbitrary description/info
        - Define starting bid and end date
        - Cancel/delete
- VIN validation/decoding service
    - Leverage third party service to perform lookups
    - Auto-supply available vehicle info
    - No DB storage, Redis/in memory only
- Active Listing
    - User bidding (latest bid must exceed most recent winning bid)
    - Render active/completed and winning user/price
- Unit Testing
- Endpoint Testing (for customized endpoints)

### Stretch Goals:
- Leverage websockets/pub-sub pattern for listings to auto-update UI as bids flow in

### Nice to Haves and Features that will not be completed
- User Authentication
    - Third party auth integration ie: Google, Facebook
    - Forgot Password and Account Delete
- User Notification System
    - In-app and email notifications for bid/listing activity to subscribed user(s)
- Remote Secure File Storage
    - Ideally a solution like S3 is leveraged for file storing and supports more than photos, but for simplicity, local filesystem and limited photo types will be allowed.
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

### Authenticated
- Active Listings
  - most recent at top
- My Listings
- Listing Detail Page
  - Bid form
  - winning bid
  - bid history

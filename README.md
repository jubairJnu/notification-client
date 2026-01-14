
# Real-Time Notification System (Admin-Driven) – MERN Stack

This project implements an admin-driven real-time notification system using the MERN stack (MongoDB, Express, React, Node.js) with Socket.IO for real-time updates.

Administrators can create and send notifications by category, and users receive notifications only if they are subscribed to the relevant categories. The system supports real-time delivery, per-user read/unread tracking, and persistent notification history.


## Overall Approach & Architecture

Since here is role based system distribution i use authentication and defince relative model like notification and notificationRecipients for tracking each user reading status.

i use here socket.io for real-time communication with backend and frontend . The user get notification immediately without page refreshing by respecting his supscription category .

## Multi-user Real-time Updates (How it’s handled)
### Category-based Socket.IO Rooms

Each category maps to a room:

- cat:announcements
- cat:system_updates
- cat:task_updates

#### When a user connects:

- Socket authenticates with JWT
- Server reads user subscriptions from DB
- Socket joins rooms for subscribed categories

#### When admin creates a notification:

- Backend saves notification in MongoDB
- Backend finds subscribed users and creates NotificationRecipient records
- Backend emits the event only to the category room:

io.to("cat:announcements").emit("notification:new", payload)

✅ Only subscribed users are in that room, so only they receive it.

### Frontend State Handling (Context API)

#### The frontend uses Context API to manage:
- notification list (inbox)
- unread count
- subscription categories
- Real-time update in UI without refresh

#### Persistence

- On page load, frontend fetches notifications via REST API
- Socket only handles “new incoming” notifications

### Assumptions
- Authentication is JWT-based
- Only admins can create notifications
- Notifications are immediately sent upon creation
- Socket reconnection is acceptable for subscription updates

### Limitations
- Free-tier hosting may limit concurrent socket connections

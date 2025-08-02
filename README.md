# Parcel Delivery System

The Parcel Delivery System is a web-based application that allows users to send, receive, and manage parcel deliveries efficiently. It provides distinct roles—Sender, Receiver, and Admin—to handle different operations. Users can create parcel requests, track delivery status, and confirm receipt. Admins oversee all activities, manage parcels and users, and control delivery workflows. The system ensures real-time updates through a well-defined status flow (e.g., Requested → Assigned → Picked Up → In Transit → Delivered/Returned), enhancing transparency and operational control.

### Used Technologies:

- Express.js
- TypeScript
- MongoDB (Mongoose)

### Features:

- Create Parcel – Sender can create new parcel delivery requests.

- View Parcels – Sender can view all their parcels with full status history.

- View Single Parcel – Get detailed information about a specific parcel.

- Update Parcel Status – Admin can update parcel status (e.g., Assigned, Picked Up, In Transit, Delivered, Returned).

- Cancel Parcel – Sender can cancel parcels if not yet dispatched.

- Confirm Delivery – Receiver can confirm delivery of parcels once received.

- View Incoming Parcels – Receiver can view all parcels sent to them.

- Status Logs – Each status update is logged for tracking and auditing.

- Track Parcel - Track parcel by public Tracking id. `TRK-YYYYMMDD-xxxxxx`

- User Role Management – Roles like `Admin`, `Sender`, `Receiver` and `Rider` are supported with permission-based access.

- Block/Unblock Parcel or User – Admin can block or unblock parcels and users as needed.

- Proper Validation and Error handling – Request data is validated using Zod to ensure clean and safe operations.

- Admin filtering - Admin can filter/search all parcel by status

- Rider assigning - Admin can asign delivery personnel.

- and many more

## # Installation & Setup :

### Clone the Repository:

```plain
git clone https://github.com/md-suhag/parcel-delivery-server.git
```

### Install Dependencies:

```markdown
npm install
```

### Environment Variables:

- Create a `.env` file in the root directory.
- Add the following environment variables:

```markdown
FRONTEND_URL= your fronted url
PORT=5000
DB_URL= your database url
NODE_ENV= your env mode

BCRYPT_SALT_ROUND= any salt round number like 10, 12, 8

JWT_ACCESS_SECRET= your access secret
JWT_ACCESS_EXPIRES= 1h
JWT_REFRESH_SECRET= your refresh secret
JWT_REFRESH_EXPIRES= 30d

ADMIN_PHONE= your admin phone
ADMIN_EMAIL= your admin email
ADMIN_PASSWORD= your admin password
ADMIN_ADDRESS= your admin address

EXPRESS_SESSION_SECRET= your session secret
```

### Run the Application:

```markdown
npm run dev
```

<!-- ![Parcel Delivery ER Diagram](./Parcel Delivery ER Diagram.jpg) -->

### ER Diagram

<img src="./Parcel Delivery ER Diagram.jpg">

## ###API ENDPOINT SUMMARY###

## #Authentication APIs

| Method | Endpoint                   | Description                             |
| ------ | -------------------------- | --------------------------------------- |
| POST   | /api/v1/auth/register      | Register user (sender/receiver)         |
| POST   | /api/v1/auth/login         | User login                              |
| POST   | /api/v1/auth/logout        | User logout                             |
| POST   | /api/v1/auth/refresh-token | get new access token with refresh token |

---

## #Parcel APIs

### For Sender

| Method | Endpoint                        | Description                            |
| ------ | ------------------------------- | -------------------------------------- |
| POST   | /api/v1/parcels/                | Create parcel                          |
| GET    | /api/v1/parcels/me              | Get all parcels sent by current sender |
| PATCH  | /api/v1/parcels/:id/cancel      | Cancel parcel (if not yet dispatched)  |
| GET    | /api/v1/parcels/:id/status-logs | Get status logs for a specific parcel  |

### For Receiver

| Method | Endpoint                    | Description                        |
| ------ | --------------------------- | ---------------------------------- |
| GET    | /api/v1/parcels/incoming    | View parcels addressed to receiver |
| PATCH  | /api/v1/parcels/:id/confirm | Confirm parcel delivery            |
| GET    | /api/v1/parcels/history     | View delivery history (received)   |

---

### For Admin

| Method | Endpoint                          | Description                                   |
| ------ | --------------------------------- | --------------------------------------------- |
| GET    | /api/v1/admin/users               | List all users                                |
| PATCH  | /api/v1/admin/users/:id/block     | Block a user                                  |
| PATCH  | /api/v1/admin/users/:id/unblock   | Unblock a user                                |
| GET    | /api/v1/admin/parcels             | List all parcels with filter/search by status |
| PATCH  | /api/v1/admin/parcels/:id/block   | Block a parcel                                |
| PATCH  | /api/v1/admin/parcels/:id/unblock | Unblock a parcel                              |
| PATCH  | /api/v1/admin/parcels/:id/status  | Update parcel delivery status                 |
| PATCH  | /api/v1/admin/parcels/:id/assign  | Assign a rider to a parcel                    |

---

## #Parcel Tracking (Public)

| Method | Endpoint                  | Description                            |
| ------ | ------------------------- | -------------------------------------- |
| GET    | /api/v1/parcels/track/:id | Track a parcel by tracking ID (public) |

---

<br>
<br>
<br>
<br>

# ### API Endpoints Details:

# # User

### 1. Register

- Endpoint: `POST /api/v1/auth/register`
- Request Body:

```json
{
  "name": "suhag",
  "phone": "01766758317",
  "email": "abdussalamsuhag104@gmail.com",
  "password": "123456@A",
  "address": "Sylhet",
  "role": "SENDER"
}
```

- Response Body:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User created successfully",
  "data": {
    "name": "suhag",
    "phone": "01766758317",
    "email": "abdussalamsuhag104@gmail.com",
    "password": "$2b$10$GOkuO.btxzrPyNSYfa7JG.OblAUxHZ.fhx0232SsSVDC/1W0ZeyrS",
    "address": "Sylhet",
    "role": "SENDER",
    "auths": [
      {
        "provider": "credentials",
        "providerId": "01766758317"
      }
    ],
    "isDeleted": false,
    "isActive": "ACTIVE",
    "_id": "688db0ac41a27e88ea9badbb",
    "createdAt": "2025-08-02T06:31:08.625Z",
    "updatedAt": "2025-08-02T06:31:08.625Z"
  }
}
```

### 2. Login

- Endpoint: `POST /api/v1/auth/login`
- Request Body:

```json
{
  "phone": "01766758317",
  "password": "123456@A"
}
```

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User Logged In Successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhkYjBhYzQxYTI3ZTg4ZWE5YmFkYmIiLCJwaG9uZSI6IjAxNzY2NzU4MzE3Iiwicm9sZSI6IlNFTkRFUiIsImlhdCI6MTc1NDExNjQ1NywiZXhwIjoxNzU0MjAyODU3fQ.JK8moJsG_e0fTVXuk4tfMlkLN_Lnb9vNikRT1_eznE0",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhkYjBhYzQxYTI3ZTg4ZWE5YmFkYmIiLCJwaG9uZSI6IjAxNzY2NzU4MzE3Iiwicm9sZSI6IlNFTkRFUiIsImlhdCI6MTc1NDExNjQ1NywiZXhwIjoxNzU2NzA4NDU3fQ.MepZzpM8B6ddD84wDQbvBjtwiAPe-JQmwR7vI7dZyww",
    "user": {
      "_id": "688db0ac41a27e88ea9badbb",
      "name": "suhag",
      "phone": "01766758317",
      "email": "abdussalamsuhag104@gmail.com",
      "address": "Sylhet",
      "role": "SENDER",
      "auths": [
        {
          "provider": "credentials",
          "providerId": "01766758317"
        }
      ],
      "isDeleted": false,
      "isActive": "ACTIVE",
      "createdAt": "2025-08-02T06:31:08.625Z",
      "updatedAt": "2025-08-02T06:31:08.625Z"
    }
  }
}
```

### 3. Get new access token with refresh token

- Endpoint: `POST /api/v1/auth/refresh-token`
- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "New Access token created successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhkYjBhYzQxYTI3ZTg4ZWE5YmFkYmIiLCJwaG9uZSI6IjAxNzY2NzU4MzE3Iiwicm9sZSI6IlNFTkRFUiIsImlhdCI6MTc1NDExNzY1MCwiZXhwIjoxNzU0MjA0MDUwfQ.-HVO3n6DkP5vStcpJVoFPpqIswGCdRq2hkq1jU3E_bU"
  }
}
```

### 4. Logout

- Endpoint: `POST /api/v1/auth/logout`
- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User Logged out successfully",
  "data": null
}
```

# # Parcel

### 1. Create Parcel

- Endpoint: `POST /api/v1/parcels`
- Request Body:

```json
{
  "type": "REGULAR",
  "weight": 4,
  "receiver": { "name": "Karim", "phone": "01711002233", "address": "Dhaka" },
  "pickingAddress": "Sylhet"
}
```

- Response Body:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Parcel created successfully",
  "data": {
    "type": "REGULAR",
    "weight": 4,
    "sender": "688db0ac41a27e88ea9badbb",
    "receiver": {
      "name": "Karim",
      "phone": "01711002233",
      "address": "Dhaka"
    },
    "pickingAddress": "Sylhet",
    "status": "REQUESTED",
    "isBlocked": false,
    "_id": "688dc717cc43801d5ba9b2cf",
    "statusLogs": [
      {
        "location": "Sylhet",
        "time": "2025-08-02T08:06:47.091Z",
        "status": "REQUESTED",
        "note": "New parcel request by Sender"
      }
    ],
    "createdAt": "2025-08-02T08:06:47.086Z",
    "updatedAt": "2025-08-02T08:06:47.086Z",
    "trackingId": "TRK-20250802-758216",
    "deliveryFee": 130,
    "deliveryDate": "2025-08-04T08:06:47.091Z"
  }
}
```

### 2. Get My Parcels

- Endpoint: `GET /api/v1/parcels/me`

- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "All Parcel retrieved successfully",
  "data": [
    {
      "_id": "688dc717cc43801d5ba9b2cf",
      "type": "REGULAR",
      "weight": 4,
      "sender": "688db0ac41a27e88ea9badbb",
      "receiver": {
        "name": "Karim",
        "phone": "01711002233",
        "address": "Dhaka"
      },
      "pickingAddress": "Sylhet",
      "status": "REQUESTED",
      "isBlocked": false,
      "statusLogs": [
        {
          "location": "Sylhet",
          "time": "2025-08-02T08:06:47.091Z",
          "status": "REQUESTED",
          "note": "New parcel request by Sender"
        }
      ],
      "createdAt": "2025-08-02T08:06:47.086Z",
      "updatedAt": "2025-08-02T08:06:47.086Z",
      "trackingId": "TRK-20250802-758216",
      "deliveryFee": 130,
      "deliveryDate": "2025-08-04T08:06:47.091Z"
    }
  ]
}
```

### 3. Cancel Parcel

- Endpoint: `PATCH /api/v1/parcels/688dc717cc43801d5ba9b2cf/cancel`

- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel Cancelled successfully",
  "data": {
    "_id": "688dc717cc43801d5ba9b2cf",
    "type": "REGULAR",
    "weight": 4,
    "sender": "688db0ac41a27e88ea9badbb",
    "receiver": {
      "name": "Karim",
      "phone": "01711002233",
      "address": "Dhaka"
    },
    "pickingAddress": "Sylhet",
    "status": "CANCELLED",
    "isBlocked": false,
    "statusLogs": [
      {
        "location": "Sylhet",
        "time": "2025-08-02T08:06:47.091Z",
        "status": "REQUESTED",
        "note": "New parcel request by Sender"
      },
      {
        "location": "Sylhet",
        "time": "2025-08-02T03:57:13.624Z",
        "status": "CANCELLED",
        "note": "Parcel cancelled by sender"
      }
    ],
    "createdAt": "2025-08-02T08:06:47.086Z",
    "updatedAt": "2025-08-02T08:08:17.343Z",
    "trackingId": "TRK-20250802-758216",
    "deliveryFee": 130,
    "deliveryDate": "2025-08-04T08:06:47.091Z"
  }
}
```

### 4. Track Parcel

- Endpoint: `GET /api/v1/parcels/:id/cancel`

- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel's details retrieved successfully",
  "data": {
    "_id": "688dc717cc43801d5ba9b2cf",
    "receiver": {
      "name": "Karim",
      "phone": "01711002233",
      "address": "Dhaka"
    },
    "isBlocked": false,
    "statusLogs": [
      {
        "location": "Sylhet",
        "time": "2025-08-02T08:06:47.091Z",
        "status": "REQUESTED",
        "note": "New parcel request by Sender"
      },
      {
        "location": "Sylhet",
        "time": "2025-08-02T03:57:13.624Z",
        "status": "CANCELLED",
        "note": "Parcel cancelled by sender"
      }
    ]
  }
}
```

### 5. Get Incomming Parcels

- Endpoint: `GET /api/v1/parcels/incomming`

- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Incomming parcels retrieved successfully",
  "data": [
    {
      "_id": "688dc9c93e93c9533d35f27d",
      "type": "REGULAR",
      "weight": 4,
      "sender": "688db0ac41a27e88ea9badbb",
      "receiver": {
        "name": "suhag",
        "phone": "01766758301",
        "address": "Dhaka"
      },
      "pickingAddress": "Sylhet",
      "status": "REQUESTED",
      "isBlocked": false,
      "statusLogs": [
        {
          "location": "Sylhet",
          "time": "2025-08-02T08:18:17.305Z",
          "status": "REQUESTED",
          "note": "New parcel request by Sender"
        }
      ],
      "createdAt": "2025-08-02T08:18:17.302Z",
      "updatedAt": "2025-08-02T08:18:17.302Z",
      "trackingId": "TRK-20250802-286914",
      "deliveryFee": 130,
      "deliveryDate": "2025-08-04T08:18:17.305Z"
    }
  ]
}
```

### 6. Confirm Parcel

- Endpoint: `PATCH /api/v1/parcels/:id/confirm`

- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Delivery confirmed successfully",
  "data": {
    "_id": "688dc9c93e93c9533d35f27d",
    "type": "REGULAR",
    "weight": 4,
    "sender": "688db0ac41a27e88ea9badbb",
    "receiver": {
      "name": "suhag",
      "phone": "01766758301",
      "address": "Dhaka"
    },
    "pickingAddress": "Sylhet",
    "status": "DELIVERED",
    "isBlocked": false,
    "statusLogs": [
      {
        "location": "Sylhet",
        "time": "2025-08-02T08:18:17.305Z",
        "status": "REQUESTED",
        "note": "New parcel request by Sender"
      },
      {
        "location": "Admin Panel",
        "time": "2025-08-02T08:13:00.134Z",
        "status": "ASSIGNED",
        "note": "Rider assigned by admin"
      },
      {
        "location": "Admin Panel",
        "time": "2025-08-02T08:13:00.134Z",
        "status": "PICKED",
        "note": "Status updated to PICKED by admin"
      },
      {
        "location": "Admin Panel",
        "time": "2025-08-02T08:13:00.134Z",
        "status": "IN_TRANSIT",
        "note": "Status updated to IN_TRANSIT by admin"
      },
      {
        "location": "Dhaka",
        "time": "2025-08-02T08:13:00.134Z",
        "status": "DELIVERED",
        "note": "Parcel accepted by receiver"
      }
    ],
    "createdAt": "2025-08-02T08:18:17.302Z",
    "updatedAt": "2025-08-02T08:26:13.356Z",
    "trackingId": "TRK-20250802-286914",
    "deliveryFee": 130,
    "deliveryDate": "2025-08-04T08:18:17.305Z",
    "assignedRider": "688dcafb3e93c9533d35f28d"
  }
}
```

### 7. Delivery History

- Endpoint: `GET /api/v1/parcels/delivery-history`

- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "All delivery  history of receiver retrieved successfully",
  "data": [
    {
      "_id": "688dc9c93e93c9533d35f27d",
      "type": "REGULAR",
      "weight": 4,
      "sender": "688db0ac41a27e88ea9badbb",
      "receiver": {
        "name": "suhag",
        "phone": "01766758301",
        "address": "Dhaka"
      },
      "pickingAddress": "Sylhet",
      "status": "DELIVERED",
      "isBlocked": false,
      "statusLogs": [
        {
          "location": "Sylhet",
          "time": "2025-08-02T08:18:17.305Z",
          "status": "REQUESTED",
          "note": "New parcel request by Sender"
        },
        {
          "location": "Admin Panel",
          "time": "2025-08-02T08:13:00.134Z",
          "status": "ASSIGNED",
          "note": "Rider assigned by admin"
        },
        {
          "location": "Admin Panel",
          "time": "2025-08-02T08:13:00.134Z",
          "status": "PICKED",
          "note": "Status updated to PICKED by admin"
        },
        {
          "location": "Admin Panel",
          "time": "2025-08-02T08:13:00.134Z",
          "status": "IN_TRANSIT",
          "note": "Status updated to IN_TRANSIT by admin"
        },
        {
          "location": "Dhaka",
          "time": "2025-08-02T08:13:00.134Z",
          "status": "DELIVERED",
          "note": "Parcel accepted by receiver"
        }
      ],
      "createdAt": "2025-08-02T08:18:17.302Z",
      "updatedAt": "2025-08-02T08:26:13.356Z",
      "trackingId": "TRK-20250802-286914",
      "deliveryFee": 130,
      "deliveryDate": "2025-08-04T08:18:17.305Z",
      "assignedRider": "688dcafb3e93c9533d35f28d"
    }
  ]
}
```

### 8. Get status logs

- Endpoint: `GET /api/v1/parcels/:id/status-logs`

- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel's status logs retrieved successfully",
  "data": {
    "_id": "688dc9c93e93c9533d35f27d",
    "sender": "688db0ac41a27e88ea9badbb",
    "statusLogs": [
      {
        "location": "Sylhet",
        "time": "2025-08-02T08:18:17.305Z",
        "status": "REQUESTED",
        "note": "New parcel request by Sender"
      },
      {
        "location": "Admin Panel",
        "time": "2025-08-02T08:13:00.134Z",
        "status": "ASSIGNED",
        "note": "Rider assigned by admin"
      },
      {
        "location": "Admin Panel",
        "time": "2025-08-02T08:13:00.134Z",
        "status": "PICKED",
        "note": "Status updated to PICKED by admin"
      },
      {
        "location": "Admin Panel",
        "time": "2025-08-02T08:13:00.134Z",
        "status": "IN_TRANSIT",
        "note": "Status updated to IN_TRANSIT by admin"
      },
      {
        "location": "Dhaka",
        "time": "2025-08-02T08:13:00.134Z",
        "status": "DELIVERED",
        "note": "Parcel accepted by receiver"
      }
    ]
  }
}
```

# # Admin

### 1. Get all users

- Endpoint: `GET /api/v1/admin/users`
- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "All users retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPage": 1
  },
  "data": [
    {
      "_id": "688db03241a27e88ea9badb8",
      "name": "System admin",
      "phone": "01711223344",
      "email": "abdussalamsuhag104@gmail.com",
      "address": "Dhaka",
      "role": "ADMIN",
      "auths": [
        {
          "provider": "credentials",
          "providerId": "abdussalamsuhag104@gmail.com"
        }
      ],
      "isDeleted": false,
      "isActive": "ACTIVE",
      "createdAt": "2025-08-02T06:29:06.074Z",
      "updatedAt": "2025-08-02T06:29:06.074Z"
    },
    {
      "_id": "688db688c207772a941835e6",
      "name": "suhag",
      "phone": "01766758317",
      "email": "abdussalamsuhag104@gmail.com",
      "address": "Sylhet",
      "role": "SENDER",
      "auths": [
        {
          "provider": "credentials",
          "providerId": "01766758317"
        }
      ],
      "isDeleted": false,
      "isActive": "ACTIVE",
      "createdAt": "2025-08-02T06:56:08.118Z",
      "updatedAt": "2025-08-02T06:56:08.118Z"
    },
    {
      "_id": "688dc9703e93c9533d35f276",
      "name": "suhag",
      "phone": "01766758301",
      "email": "abdussalamsuhag104@gmail.com",
      "address": "Sylhet",
      "role": "RECEIVER",
      "auths": [
        {
          "provider": "credentials",
          "providerId": "01766758301"
        }
      ],
      "isDeleted": false,
      "isActive": "ACTIVE",
      "createdAt": "2025-08-02T08:16:48.500Z",
      "updatedAt": "2025-08-02T08:16:48.500Z"
    },
    {
      "_id": "688dcafb3e93c9533d35f28d",
      "name": "mr rider",
      "phone": "01766750011",
      "email": "rider@gmail.com",
      "address": "Sylhet",
      "role": "RIDER",
      "auths": [
        {
          "provider": "credentials",
          "providerId": "01766750011"
        }
      ],
      "isDeleted": false,
      "isActive": "ACTIVE",
      "createdAt": "2025-08-02T08:23:23.085Z",
      "updatedAt": "2025-08-02T08:23:23.085Z"
    }
  ]
}
```

### 2. Block user

- Endpoint: `PATCH /api/v1/admin/users/:id/block`
- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User blocked successfully",
  "data": {
    "_id": "688dcafb3e93c9533d35f28d",
    "name": "mr rider",
    "phone": "01766750011",
    "isActive": "BLOCKED"
  }
}
```

### 3. Unblock user

- Endpoint: `PATCH /api/v1/admin/users/:id/unblock`
- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User unblocked successfully",
  "data": {
    "_id": "688dcafb3e93c9533d35f28d",
    "name": "mr rider",
    "phone": "01766750011",
    "isActive": "ACTIVE"
  }
}
```

### 4. Get All parcels

- Endpoint: `GET /api/v1/admin/parcels`
- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "All parcels retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPage": 1
  },
  "data": [
    {
      "_id": "688dc9c93e93c9533d35f27d",
      "type": "REGULAR",
      "weight": 4,
      "sender": "688db0ac41a27e88ea9badbb",
      "receiver": {
        "name": "suhag",
        "phone": "01766758301",
        "address": "Dhaka"
      },
      "pickingAddress": "Sylhet",
      "status": "DELIVERED",
      "isBlocked": false,
      "statusLogs": [
        {
          "location": "Sylhet",
          "time": "2025-08-02T08:18:17.305Z",
          "status": "REQUESTED",
          "note": "New parcel request by Sender"
        },
        {
          "location": "Admin Panel",
          "time": "2025-08-02T08:13:00.134Z",
          "status": "ASSIGNED",
          "note": "Rider assigned by admin"
        },
        {
          "location": "Admin Panel",
          "time": "2025-08-02T08:13:00.134Z",
          "status": "PICKED",
          "note": "Status updated to PICKED by admin"
        },
        {
          "location": "Admin Panel",
          "time": "2025-08-02T08:13:00.134Z",
          "status": "IN_TRANSIT",
          "note": "Status updated to IN_TRANSIT by admin"
        },
        {
          "location": "Dhaka",
          "time": "2025-08-02T08:13:00.134Z",
          "status": "DELIVERED",
          "note": "Parcel accepted by receiver"
        }
      ],
      "createdAt": "2025-08-02T08:18:17.302Z",
      "updatedAt": "2025-08-02T08:26:13.356Z",
      "trackingId": "TRK-20250802-286914",
      "deliveryFee": 130,
      "deliveryDate": "2025-08-04T08:18:17.305Z",
      "assignedRider": "688dcafb3e93c9533d35f28d"
    },
    {
      "_id": "688dc717cc43801d5ba9b2cf",
      "type": "REGULAR",
      "weight": 4,
      "sender": "688db0ac41a27e88ea9badbb",
      "receiver": {
        "name": "Karim",
        "phone": "01711002233",
        "address": "Dhaka"
      },
      "pickingAddress": "Sylhet",
      "status": "CANCELLED",
      "isBlocked": false,
      "statusLogs": [
        {
          "location": "Sylhet",
          "time": "2025-08-02T08:06:47.091Z",
          "status": "REQUESTED",
          "note": "New parcel request by Sender"
        },
        {
          "location": "Sylhet",
          "time": "2025-08-02T03:57:13.624Z",
          "status": "CANCELLED",
          "note": "Parcel cancelled by sender"
        }
      ],
      "createdAt": "2025-08-02T08:06:47.086Z",
      "updatedAt": "2025-08-02T08:08:17.343Z",
      "trackingId": "TRK-20250802-758216",
      "deliveryFee": 130,
      "deliveryDate": "2025-08-04T08:06:47.091Z"
    }
  ]
}
```

### 5. Block parcel

- Endpoint: `PATCH /api/v1/admin/parcels/:id/block`
- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel blocked successfully",
  "data": {
    "_id": "688dc717cc43801d5ba9b2cf",
    "isBlocked": true,
    "statusLogs": [
      {
        "location": "Sylhet",
        "time": "2025-08-02T08:06:47.091Z",
        "status": "REQUESTED",
        "note": "New parcel request by Sender"
      },
      {
        "location": "Sylhet",
        "time": "2025-08-02T03:57:13.624Z",
        "status": "CANCELLED",
        "note": "Parcel cancelled by sender"
      },
      {
        "location": "Admin Panel",
        "time": "2025-08-02T08:13:00.134Z",
        "status": "BLOCKED",
        "note": "Blocked by admin"
      }
    ],
    "trackingId": "TRK-20250802-758216"
  }
}
```

### 6. Unblock parcel

- Endpoint: `PATCH /api/v1/admin/parcels/:id/unblock`
- Request Body:

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel unblocked successfully",
  "data": {
    "_id": "688dc717cc43801d5ba9b2cf",
    "isBlocked": false,
    "statusLogs": [
      {
        "location": "Sylhet",
        "time": "2025-08-02T08:06:47.091Z",
        "status": "REQUESTED",
        "note": "New parcel request by Sender"
      },
      {
        "location": "Sylhet",
        "time": "2025-08-02T03:57:13.624Z",
        "status": "CANCELLED",
        "note": "Parcel cancelled by sender"
      },
      {
        "location": "Admin Panel",
        "time": "2025-08-02T08:13:00.134Z",
        "status": "BLOCKED",
        "note": "Blocked by admin"
      },
      {
        "location": "Admin Panel",
        "time": "2025-08-02T08:13:00.134Z",
        "status": "UNBLOCKED",
        "note": "Unblocked by admin"
      }
    ],
    "trackingId": "TRK-20250802-758216"
  }
}
```

### 7. Update parcel status

- Endpoint: `PATCH /api/v1/admin/parcels/:id/status`
- Request Body:

```json
{
  "status": "PICKED"
}
```

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel status updated successfully",
  "data": {
    "_id": "688dc9c93e93c9533d35f27d",
    "status": "PICKED",
    "statusLogs": [
      {
        "location": "Sylhet",
        "time": "2025-08-02T08:18:17.305Z",
        "status": "REQUESTED",
        "note": "New parcel request by Sender"
      },
      {
        "location": "Admin Panel",
        "time": "2025-08-02T08:13:00.134Z",
        "status": "ASSIGNED",
        "note": "Rider assigned by admin"
      },
      {
        "location": "Admin Panel",
        "time": "2025-08-02T08:13:00.134Z",
        "status": "PICKED",
        "note": "Status updated to PICKED by admin"
      }
    ]
  }
}
```

### 8. Assign rider

- Endpoint: `PATCH /api/v1/admin/parcels/:id/assign`
- Request Body:

```json
{
  "riderId": "688dcafb3e93c9533d35f28d"
}
```

- Response Body:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Rider assigned in parcel successfully",
  "data": {
    "_id": "688dc9c93e93c9533d35f27d",
    "status": "ASSIGNED",
    "statusLogs": [
      {
        "location": "Sylhet",
        "time": "2025-08-02T08:18:17.305Z",
        "status": "REQUESTED",
        "note": "New parcel request by Sender"
      },
      {
        "location": "Admin Panel",
        "time": "2025-08-02T08:13:00.134Z",
        "status": "ASSIGNED",
        "note": "Rider assigned by admin"
      }
    ],
    "assignedRider": "688dcafb3e93c9533d35f28d"
  }
}
```

### Error Handling

The application handles errors using global error handling with appropriate error messages and status codes.

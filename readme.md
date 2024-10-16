# Tender Management System

This repository contains a Tender Management System . The project consists of two main folders: `frontend` and `backend`.

## Getting Started

To set up the project locally, follow these steps:

1. **Clone the Repository**
   - Clone the repository using the following command:
     ```bash
     git clone https://github.com/ubaish01/assignemt-vi-exports
     cd assignemt-vi-exports
     ```

2. **Backend Setup**
   - Move to the backend folder:
     ```bash
     cd backend
     ```
   - Update the `.env` file by adding your variables in it.
   - Install the required packages:
     ```bash
     npm install
     ```
   - Start the server:
     ```bash
     npm run dev
     ```
     The server will start on port **8000** and create the following users in the database:
     - Five users: `user1@gmail.com`, `user2@gmail.com`, `user3@gmail.com`, `user4@gmail.com`, and `user5@gmail.com`, all with the password `user123`.
     - One admin user: `admin@gmail.com` with the password `admin123`.

3. **Frontend Setup**
   - Move to the frontend folder:
     ```bash
     cd ../frontend
     ```
   - Install the required packages:
     ```bash
     npm install
     ```
   - Start the server:
     ```bash
     npm run dev
     ```
     The server will start on port **5173**.


## Preview

Watch the preview video featuring the project here: [Preview Video](https://www.youtube.com/watch?v=WPJ6fEksd3k)


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
import { addUser, deleteUser, getUserByEmail, getUserByID, getUserByUsername, getUsers } from '../models/User';
import { addUserHealthData, deleteUserHealthDataByID, getUserHealthDataByID } from '../models/UserHealth'
import { addUserPreference, deleteUserPreferenceByID, getUserPreferenceByID } from '../models/UserPreference'

// Here, we will return all info about the user to the frontend which will be shown to the user
// this will include userID, username, 

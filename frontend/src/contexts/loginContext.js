import React from "react";
import { createContext } from "react";

export const LoggedInContext = createContext(false); // Defaults to false as not logged in
export const UserIDContext = createContext(null); // Defaults to null as no user ID
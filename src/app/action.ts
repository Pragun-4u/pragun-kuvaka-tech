"use server";

import { cookies } from "next/headers";

export async function getCountriesCallingCodes() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,idd"
    );

    const countries = await response.json();

    const formattedCallingCodes = countries.map((country: any) => {
      return {
        countryName: country.name.common,
        callingCode:
          (country.idd?.root || "") +
          (country.idd?.suffixes.length ? country.idd.suffixes?.[0] : ""),
      };
    });

    return { data: formattedCallingCodes, status: true, error: null };
  } catch (error) {
    console.error("Error fetching countries calling codes:", error);
    return { data: [], status: false, error: "Failed to fetch data" };
  }
}

export async function loginSetCookie() {
  try {
    const cookie = await cookies();
    cookie.set({
      name: "login",
      value: "true",
      maxAge: 60 * 60 * 24 * 7,
    });
    return { status: true, message: "Login cookie set successfully" };
  } catch (error) {
    console.error("Error setting login cookie:", error);
    return { status: false, message: "Failed to set login cookie" };
  }
}

export async function logoutSetCookie() {
  try {
    const cookie = await cookies();
    cookie.set({
      name: "login",
      value: "false",
      maxAge: 0,
    });
    return { status: true, message: "Logout cookie set successfully" };
  } catch (error) {
    console.error("Error setting logout cookie:", error);
    return { status: false, message: "Failed to set logout cookie" };
  }
}

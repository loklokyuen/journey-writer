import {
	FaBinoculars,
	FaLandmark,
	FaShoppingBag,
	FaSpa,
	FaMountain,
	FaUtensils,
	FaUser,
	FaHeart,
	FaUsers,
	FaHome,
	FaBriefcase,
} from "react-icons/fa";

export const TRIP_TYPES = [
	{
		value: "sightseeing",
		label: "Sightseeing",
		Icon: FaBinoculars,
		pastel: "blue",
	},
	{ value: "history", label: "History", Icon: FaLandmark, pastel: "amber" },
	{ value: "shopping", label: "Shopping", Icon: FaShoppingBag, pastel: "pink" },
	{ value: "relaxing", label: "Relaxing", Icon: FaSpa, pastel: "emerald" },
	{
		value: "adventure",
		label: "Adventure",
		Icon: FaMountain,
		pastel: "purple",
	},
	{ value: "foodie", label: "Foodie", Icon: FaUtensils, pastel: "rose" },
] as const;

export const COMPANIONS = [
	{ value: "solo", label: "Solo", Icon: FaUser, pastel: "emerald" },
	{ value: "partner", label: "Partner", Icon: FaHeart, pastel: "rose" },
	{ value: "friends", label: "Friends", Icon: FaUsers, pastel: "sky" },
	{ value: "family", label: "Family", Icon: FaHome, pastel: "teal" },
	{
		value: "coworkers",
		label: "Coworkers",
		Icon: FaBriefcase,
		pastel: "yellow",
	},
] as const;

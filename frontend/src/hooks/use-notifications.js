import { useEffect, useState } from "react";
import { getRequest, putRequest } from "../../request";

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [newNotificationsCount, setNewNotificationsCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await getRequest("/notifications");
            const fetchedNotifications = res.data.notifications;

            // Set notifications
            setNotifications(fetchedNotifications);

            // Calculate new notifications count (created within the last 3 minutes)
            const now = new Date();
            const newCount = fetchedNotifications.filter(notification => {
                const notificationTime = new Date(notification.createdAt);
                const timeDiffInMinutes = (now - notificationTime) / (1000 * 60);
                return timeDiffInMinutes < 5;
            }).length;

            // Set new notifications count
            setNewNotificationsCount(newCount);
        } catch (error) {
            console.log(error);
        }
    };

    const markNotificationsAsViewed = async () => {
        try {
            await putRequest("/notifications/update");
            // After marking as viewed, reset the new notifications count
            setNewNotificationsCount(0);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return { notifications, newNotificationsCount, markNotificationsAsViewed };
};

export default useNotifications;
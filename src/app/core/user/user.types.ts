export interface User {
    user_id: string;
    email: string;
    username: string;
    password: string;
    user_full_name: string;
    user_need_change_password: string;
    user_status: string;
    user_type: string;
    user_active_date: Date;
    user_inactive_date: Date;
    user_last_login: Date;
    user_last_lock: Date;
    user_last_reset_password: Date;
    user_last_change_password: Date;
}

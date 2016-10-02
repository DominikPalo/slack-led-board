declare namespace Slack {
    interface Data {
        self: Self;
        team: Team;
        latest_event_ts: string;
        channels: Channel[];
        groups: Group[];
        ims: Im[];
        cache_ts: number;
        subteams: any;
        dnd: Dnd;
        users: User[];
        cache_version: string;
        cache_ts_version: string;
        bots: Bot[];
        url: string;
    }

    interface Self {
        id: string;
        name: string;
        prefs: any;
        created: number;
        manual_presence: string;
    }

    interface Team {
        id: string;
        name: string;
        email_domain: string;
        domain: string;
        msg_edit_window_mins: number;
        prefs: any;
        icon: any;
        over_storage_limit: boolean;
        plan: string;
    }

    interface Channel {
        id: string;
        name: string;
        is_channel: boolean;
        created: number;
        creator: string;
        is_archived: boolean;
        is_general: boolean;
        has_pins: boolean;
        is_member: boolean;

        //These properties are accessible only for members
        last_read?: number;
        latest?: any;
        unread_count?: number;
        unread_count_display?: number;
        members?: any;
        topic?: any;
        purpose?: any;
    }

    interface Group {
        id: string;
        name: string;
        is_group: boolean;
        created: number;
        creator: string;
        is_archived: boolean;
        is_mpim: boolean;
        has_pins: boolean;
        is_open: boolean;
        last_read: string;
        latest: any;
        unread_count: number;
        unread_count_display: number;
        members: any;
        topic: any;
        purpose: any;
    }

    interface Im {
        id: string;
        user: string;
        created: number;
        is_im: boolean;
        is_org_shared: boolean;
        has_pins: boolean;
        last_read: string;
        latest: any;
        unread_count: number;
        unread_count_display: number;
        is_open: boolean;
    }

    interface Dnd {
        dnd_enabled: boolean;
        next_dnd_start_ts: number;
        next_dnd_end_ts: number;
        snooze_enabled: boolean;
    }

    interface User {
        id: string;
        team_id: string;
        name: string;
        deleted: boolean;
        status?: any;
        color?: string;
        real_name?: string;
        tz?: string;
        tz_label?: string;
        tz_offset?: number;
        profile: any;
        is_admin?: boolean;
        is_owner?: boolean;
        is_primary_owner?: boolean;
        is_restricted?: boolean;
        is_ultra_restricted?: boolean;
        is_bot?: boolean;
        presence: "away" | "active";
    }

    interface Bot {
        id: string;
        deleted: boolean;
        name: string;
        icons: any;
    }
}

declare namespace RTMEvents {

    interface PresenceChange {
        type: "presence_change",
        user: string,
        presence: "away" | "active";
    }

    interface Message {
        type: "message",
        user: string;
        text: string;
        channel: string;
        team: string;
        ts: string;
    }

    interface ImMarked {
        type: "im_marked",
        channel: string;
        ts: string;
        dm_count: number;
        unread_count_display: number;
        num_mentions_display: number;
        mention_count_display: number;
        event_ts: string;
    }

    interface ChannelMarked {
        type: "channel_marked",
        channel: string;
        ts: string;
        unread_count: number;
        unread_count_display: number;
        num_mentions: number;
        num_mentions_display: number;
        mention_count: number;
        mention_count_display: number;
        event_ts: string;
    }

    interface GroupMarked {
        type: "group_marked",
        channel: string;
        ts: string;
        unread_count: number;
        unread_count_display: number;
        num_mentions: number;
        num_mentions_display: number;
        mention_count: number;
        mention_count_display: number;
        event_ts: string;
    }

    interface DndUpdatedUser {
        type: "dnd_updated_user";
        user: string;
        dnd_status: DndStatus;
    }

    interface DndStatus {
        dnd_enabled: boolean;
        next_dnd_start_ts: string;
        next_dnd_end_ts: string;
    }
}
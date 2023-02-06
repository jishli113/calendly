import React from 'react';
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'

export const SidebarData = [
    {
        title:"Events",
        icon: <FontAwesomeIcon icon={faNoteSticky}/>,
        link: "/events"
    },
    {
        title:"Social",
        icon: <FontAwesomeIcon icon={faUserGroup}/>,
        link:"/social"
    },
    {
        title:"Settings",
        icon: <FontAwesomeIcon icon={faGear}/>,
        link:"/settings"
    }
];
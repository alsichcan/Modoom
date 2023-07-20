import ProfileAvatar from "../../common/ProfileAvatar";
import React from "react";

const ReelProfileGroup = ({size, modoom, limit, useLink}) => {
    const n_vacancies = modoom.accom - modoom.n_members;
    const profiles = [...modoom.enrollments.filter(e => e.accepted).map(e => e.profile), ...Array(n_vacancies)].slice(0, limit).reverse();
    return (
        <div className='d-flex align-items-center'>
            <div className='icon-group align-items-center'>
                {profiles.map((profile, index) => {
                    if (profile) {
                        return <ProfileAvatar className='icon-item'
                                              key={profile.uid}
                                              useLink={useLink}
                                              size='2xl'
                                              profile={profile}
                                              style={{width: size, height: size}}/>;
                    } else {
                        return <div key={index} className='avatar icon-item bg-soft-primary'
                                    style={{width: size, height: size}}/>
                    }
                })}
            </div>
        </div>
    );
};

export default ReelProfileGroup;
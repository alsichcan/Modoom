import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Media,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Nav,
  NavLink,
  Button,
  Collapse,
  Col,
  Row
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '../../../common/Avatar';
import Flex from '../../../common/Flex';
import AppContext, { ChatContext } from '../../../../context/Context';
import { isIterableArray } from '../../../../helpers/utils';
import classNames from 'classnames';


const ThreadInfo = ({ thread, isOpenThreadInfo }) => {
  const [isOpenMemberCollapse, setIsOpenMemberCollapse] = useState(false);
  const [isOpenSharedMediaCollapse, setIsOpenSharedMediaCollapse] = useState(false);
  const { isRTL } = useContext(AppContext);
  const { users, groups, getUser } = useContext(ChatContext);
  const user = getUser(thread);

  return (
    <div className={classNames('conversation-info', { show: isOpenThreadInfo })}>
      <div className="h-100 overflow-auto scrollbar perfect-scrollbar">
        <Media className="position-relative align-items-center p-3 border-bottom">
            <Avatar className={user.status} size="xl" src={user.avatarSrc} />
            <Media tag={Flex} body className="ml-2 flex-between-center">
              <h6 className="mb-0">
                <Link to="/pages/profile" className="text-decoration-none stretched-link text-700">
                  {user.name}
                </Link>
              </h6>
              <UncontrolledButtonDropdown className="z-index-1" size="sm" onClick={e => e.stopPropagation()}>
                <DropdownToggle color="link" className="text-400   pr-0 fs-0" size="sm">
                  <FontAwesomeIcon icon="cog" transform="shrink-3 down-4" />
                </DropdownToggle>
                <DropdownMenu className="py-2 rounded-soft border">
                  <DropdownItem className="cursor-pointer">Mute</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem className="cursor-pointer">Archive</DropdownItem>
                  <DropdownItem className="cursor-pointer">Delete</DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </Media>
          </Media>
          <div className="px-3 pt-2">
            <Nav vertical className="text-sans-serif font-weight-medium">
              <NavLink className="py-1 px-0 text-600 cursor-pointer">
                <span className="conversation-info-icon">
                  <FontAwesomeIcon icon="search" className="mr-1" transform="shrink-1 down-3" />
                </span>{' '}
                Search in Conversation
              </NavLink>
              <NavLink className="py-1 px-0 text-600 cursor-pointer">
                <span className="conversation-info-icon">
                  <FontAwesomeIcon icon="pencil-alt" className="mr-1" transform="shrink-1 down-3" />
                </span>{' '}
                Edit Nicknames
              </NavLink>
              <NavLink className="py-1 px-0 text-600 cursor-pointer">
                <span className="conversation-info-icon">
                  <FontAwesomeIcon icon="palette" className="mr-1" transform="shrink-1 down-3" />
                </span>{' '}
                Change Color
              </NavLink>
              <NavLink className="py-1 px-0 text-600 cursor-pointer">
                <span className="conversation-info-icon">
                  <FontAwesomeIcon icon="thumbs-up" className="mr-1" transform="shrink-1 down-3" />
                </span>{' '}
                Change Emoji
              </NavLink>
              <NavLink className="py-1 px-0 text-600 cursor-pointer">
                <span className="conversation-info-icon">
                  <FontAwesomeIcon icon="bell" className="mr-1" transform="shrink-1 down-3" />
                </span>{' '}
                Notifications
              </NavLink>
            </Nav>
          </div>
          <hr className="my-2" />
          <div className="px-3" id={`others-info`}>
            {isIterableArray(thread.userId) && (
              <div className="title">
                <Button
                  color="link"
                  className="btn-accordion hover-text-decoration-none dropdown-indicator w-100"
                  aria-expanded={isOpenMemberCollapse}
                  onClick={() => setIsOpenMemberCollapse(!isOpenMemberCollapse)}
                >
                  Member
                </Button>
                <Collapse isOpen={isOpenMemberCollapse}>
                  {groups
                    .find(({ id }) => id === thread.userId[0])
                    .members.map((member, index) => {
                      const user = users.find(({ id }) => id === member.userId);

                      return (
                        <Media className="align-items-center py-2 hover-actions-trigger" key={index}>
                          <Avatar className={user.status} size="xl" src={user.avatarSrc} />
                          <Media body tag={Flex} justify="between" className="ml-2">
                            <div>
                              <h6 className="mb-0">
                                <Link to="/pages/profile" className="text-700">
                                  {user.name}
                                </Link>
                              </h6>
                              <div className="fs--2 text-400">{member.designation}</div>
                            </div>
                            <UncontrolledButtonDropdown
                              className="hover-actions position-relative dropdown-active-trigger z-index-1"
                              onClick={e => e.stopPropagation()}
                            >
                              <DropdownToggle
                                color="link"
                                className="text-400 dropdown-toggle dropdown-caret-none py-0"
                                size="sm"
                                id={`user-settings-dropdown`}
                              >
                                <FontAwesomeIcon icon="ellipsis-h" />
                              </DropdownToggle>
                              <DropdownMenu className="py-2 rounded-soft border">
                                <DropdownItem tag="a" href="#!">
                                  Message
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem tag="a" href="#!">
                                  View Profile
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </Media>
                        </Media>
                      );
                    })}
                </Collapse>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

ThreadInfo.propTypes = {
  thread: PropTypes.object.isRequired,
  isOpenThreadInfo: PropTypes.bool.isRequired
};

export default ThreadInfo;

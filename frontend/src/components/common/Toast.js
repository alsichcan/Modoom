import React from 'react';
import PropTypes from 'prop-types';
import { cssTransition } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";

export const Fade = cssTransition({ enter: 'fadeIn', exit: 'fadeOut' });

export const CloseButton = ({ closeToast }) => (
  <FontAwesomeIcon icon={faTimes} className="my-2 fs--2" style={{ opacity: 0.5 }} onClick={closeToast} />
);

CloseButton.propTypes = { closeToast: PropTypes.func };

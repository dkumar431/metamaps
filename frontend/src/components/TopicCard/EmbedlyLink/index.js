/* global embedly */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Card from './Card'

class EmbedlyLink extends Component {
  constructor(props) {
    super(props)

    this.state = {
      linkEdit: ''
    }
  }

  removeLink = () => {
    this.props.updateTopic({ link: null })
  }

  resetLink = () => {
    this.setState({ linkEdit: '' })
  }

  onLinkChangeHandler = e => {
    this.setState({ linkEdit: e.target.value })
  }

  onLinkKeyUpHandler = e => {
    const ENTER_KEY = 13
    if (e.which === ENTER_KEY) {
      const { linkEdit } = this.state
      this.setState({ linkEdit: '' })
      this.props.updateTopic({ link: linkEdit })
    }
  }

  render = () => {
    const { link, authorizedToEdit, topicId } = this.props
    const { linkEdit } = this.state
    const hasAttachment = !!link

    if (!hasAttachment && !authorizedToEdit) return null

    return (
      <div className={hasAttachment ? 'embeds' : 'link-adder'}>
        <div className="addLink"
          style={{ display: hasAttachment ? 'none' : 'block' }}
        >
          <div id="addLinkIcon"></div>
          <div id="addLinkInput">
            <input ref={input => (this.linkInput = input)}
              placeholder="Enter or paste a link"
              value={linkEdit}
              onChange={this.onLinkChangeHandler}
              onKeyUp={this.onLinkKeyUpHandler}></input>
            {linkEdit && <div id="addLinkReset" onClick={this.resetLink}></div>}
          </div>
        </div>
        {link && <Card key={topicId} link={link} />}
        {authorizedToEdit && (
          <div id="linkremove"
            style={{ display: hasAttachment ? 'block' : 'none' }}
            onClick={this.removeLink}
          />
        )}
      </div>
    )
  }
}

EmbedlyLink.propTypes = {
  topicId: PropTypes.number,
  link: PropTypes.string,
  authorizedToEdit: PropTypes.bool,
  updateTopic: PropTypes.func
}

export default EmbedlyLink

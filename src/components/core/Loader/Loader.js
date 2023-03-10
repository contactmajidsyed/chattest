import React, { PureComponent } from "react"
import { ClipLoader, BeatLoader } from "react-spinners";

export default class Loader extends PureComponent {
  render() {
    return (
      <span className="loader">
        <ClipLoader size={15} color={this.props.color || "#fff"} {...this.props} />
      </span>
    )
  }
}

export class TypingLoader extends PureComponent {
  render() {
    return (
      <BeatLoader size={5} {...this.props} />
    )
  }
}

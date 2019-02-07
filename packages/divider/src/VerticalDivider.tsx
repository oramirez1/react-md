import React, {
  useRef,
  useState,
  useEffect,
  FunctionComponent,
  HTMLAttributes,
} from "react";

import Divider from "./Divider";

export interface IVerticalDividerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The max height for the vertical divider. This number **must** be greater than 0 to work
   * correctly.
   *
   * When the value is between 0 and 1, it will be used as a multiplier with the
   * parent element's height. When the value is greater than 1, it will be used
   * in `Math.min(parentElementHeight, maxHeight)`.
   */
  maxHeight?: number;
}

interface IVerticalDividerDefaultProps {
  maxHeight: number;
}

type VerticalDividerWithDefaultProps = IVerticalDividerProps &
  IVerticalDividerDefaultProps;

/**
 * This is a small hook that is used to automatically create a vertical divider based
 * on the computed height of its parent element.
 *
 * @param maxHeight The max height for the vertical divider. When the value is between
 * 0 and 1, it will be used as a percentage. Otherwise the smaller value of parent element
 * height and this will be used.
 */
export function useVerticalDividerHeight(maxHeight: number) {
  if (process.env.NODE_ENV !== "production" && maxHeight < 0) {
    throw new Error(
      "The `maxHeight` for a vertical divider height must be greater than 0"
    );
  }

  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (ref.current && ref.current.parentElement) {
      const h = ref.current.parentElement.offsetHeight;
      if (maxHeight <= 1) {
        setHeight(h * maxHeight);
      } else {
        setHeight(Math.min(h, maxHeight));
      }
    }
  }, [ref]);

  return { ref, height };
}

/**
 * This component is used to create a vertical divider based on a parent element's
 * height. This is really only needed when the parent element **has no defined height**.
 * If there is a defined height, this component is not worth much as the height can
 * be computed in css as normal. This really just fixes the issue that the height would
 * be set to `auto` (which computes to 0 most of the time) when it is not set on a parent
 * element.
 */
const VerticalDivider: FunctionComponent<
  IVerticalDividerProps
> = providedProps => {
  const {
    style,
    maxHeight,
    ...props
  } = providedProps as VerticalDividerWithDefaultProps;

  const { ref, height } = useVerticalDividerHeight(maxHeight);
  return <Divider {...props} style={{ ...style, height }} ref={ref} vertical />;
};

const defaultProps: IVerticalDividerDefaultProps = {
  maxHeight: 1,
};
VerticalDivider.defaultProps = defaultProps;

if (process.env.NODE_ENV !== "production") {
  let PropTypes = null;
  try {
    PropTypes = require("prop-types");
  } catch (e) {}

  if (PropTypes) {
    VerticalDivider.propTypes = {
      maxHeight: PropTypes.number,
      // @ts-ignore
      _validateMaxHeight: (
        props: VerticalDividerWithDefaultProps,
        _: string,
        componentName: string
      ) => {
        if (props.maxHeight < 0) {
          return new Error(
            `The maxHeight prop for \`${componentName}\` must be a number greater ` +
              `than 0, but received \`${props.maxHeight}\`.`
          );
        }

        return null;
      },
    };
  }
}

export default VerticalDivider;
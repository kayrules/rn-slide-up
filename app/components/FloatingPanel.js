import React, { Component } from 'react';
import {
	StyleSheet,
	TouchableWithoutFeedback,
	Text,
	Dimensions,
	PanResponder,
	Animated,
	View
} from 'react-native';
// import * as Animatable from 'react-native-animatable'

const {
	width: _windowWidth,
	height: _windowHeight
} = Dimensions.get('window');

export default class FloatingPanel extends Component
{

	constructor(props) {
		super(props);
		this.initWidth = _windowWidth - props.handlerMargin * 2;
		this.initialPos = _windowHeight - props.handlerHeight;

		this.state = {
			expanded: false,
			pan: new Animated.ValueXY(),
			borderRadius: new Animated.Value(props.borderRadius),
			transWidth: new Animated.Value(this.initWidth),
			handlerMargin: new Animated.Value(props.handlerMargin),
			handlerHeight: props.handlerHeight,
			handlerPos: this.initialPos
		};
	}

	measure(ox, oy, width, height, px, py) {
		console.log("ox: " + ox);
		console.log("oy: " + oy);
		console.log("width: " + width);
		console.log("height: " + height);
		console.log("px: " + px);
		console.log("py: " + py);
	}


	componentWillMount() {
		this._panResponder = PanResponder.create({
			onMoveShouldSetResponderCapture: () => true,
			onMoveShouldSetPanResponderCapture: () => true,

			// Initially, set the value of x and y to 0 (the center of the screen)
			onPanResponderGrant: (e, {dx, dy}) => {
				this.state.pan.setOffset({x: 0, y: this.state.pan.y._value});
				this.state.pan.setValue({x: 0, y: 0});
				// console.log();
				// this.setState({handlerPos: e.nativeEvent.locationY});
				// this.onPanHandler();
			},

			// When we drag/pan the object, set the delate to the states pan position
			onPanResponderMove: (e, {dx, dy}) => {
				self = this;
				this.state.pan.setValue({x: 0, y: dy});
				// this.setState({handlerPos: e.nativeEvent.locationY});
				// var ratio = Math.abs(dy) / (_windowHeight - this.props.handlerHeight);
				// var radius = ratio * this.props.borderRadius;
				// var margin; // = ratio * this.props.handlerMargin;
				// var missingWidth = ratio * (_windowWidth - initWidth);
				// var margin = this.props.handlerMargin - missingWidth / 2;
				// var width = initWidth + missingWidth;
				var ratio, margin;
				// swipe up
				if(dy < 0) {
					// radius = this.props.borderRadius - radius;
					ratio = Math.abs(dy) / this.initialPos;
				}
				else {
					ratio = 1 - Math.abs(dy) / this.initialPos;
				}
				if(ratio > 1) ratio = 1;
				else if(ratio < 0) ratio = 0;
				// else {
				// 	margin = this.state.handlerMargin + margin;
				// }
				// margin = this.props.handlerMargin - ratio * this.props.handlerMargin;
				// if(margin < 0) margin = 0;
				// else if(margin > this.props.handlerMargin) margin = this.props.handlerMargin;
				var newPos = this.initialPos * ratio;
				// this.setState({handlerPos: newPos});
				// if(newPos )
				// if(radius < 3) radius = 3;
				// this.state.borderRadius.setValue(radius);
				// this.state.transWidth.setValue(width);
				// this.state.handlerMargin.setValue(margin);
			},

			onPanResponderRelease: (e, {vx, vy}) => {
				this.state.pan.flattenOffset();
				// swipe up
				if(vy < 0) {
					Animated.spring(
						this.state.pan,
						{toValue: {x: 0, y: this.props.handlerHeight-_windowHeight}}
					).start();
					Animated.spring(
						this.state.borderRadius,
						{toValue: 0}
					).start();
					Animated.spring(
						this.state.transWidth,
						{toValue: _windowWidth}
					).start();
					Animated.spring(
						this.state.handlerMargin,
						{toValue: 0}
					).start();
					this.setState({expanded: true});
				} // swipe down
				else {
					Animated.spring(
						this.state.pan,
						{toValue: {x: 0, y: 0}}
					).start();
					Animated.spring(
						this.state.borderRadius,
						{toValue: this.props.borderRadius}
					).start();
					Animated.spring(
						this.state.transWidth,
						{toValue: _windowWidth - this.props.handlerMargin * 2}
					).start();
					Animated.spring(
						this.state.handlerMargin,
						{toValue: this.props.handlerMargin}
					).start();
					this.setState({expanded: false});					
				}
			}
		});
	}




	render() {
		const { pan, borderRadius, handlerMargin, transWidth } = this.state;
		const [translateY, translateW] = [pan.y, transWidth];
		const hoverStyle = {
			transform: [{translateY}],
			borderRadius: borderRadius,
			top: this.initialPos,
			left: handlerMargin,
			width: translateW,
		};
		const overlayStyle = {
			backgroundColor: this.props.showOverlay ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
		};

		return (
			<View style={[styles.overlay, overlayStyle]}>
				<Animated.View
					ref="panel"
					style={[styles.hoverbar, hoverStyle]}
					{...this._panResponder.panHandlers}
					>
						<TouchableWithoutFeedback
							onPress={this.measure.bind(this)}
							>
							<View style={{backgroundColor:'red'}}>
								<Text style={{padding: 10}}>
									Welcome! [{this.state.handlerPos}]
								</Text>
							</View>
						</TouchableWithoutFeedback>
				</Animated.View>
			</View>
		);
	}
}

// pointerEvents="none"


const styles = StyleSheet.create({
	overlay: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	},
	hoverbar: {
		flex: 1,
		backgroundColor: 'white',
		height: _windowHeight,
		position: 'absolute',
		shadowColor: 'black',
		shadowOffset: {width: 0, height: 4},
		shadowOpacity: 0.3,
		shadowRadius: 60 / 2,
		zIndex: 1
	}
});

FloatingPanel.defaultProps = {
	handlerMargin: 15,
	handlerHeight: 60,
	borderRadius: 0,
	showOverlay: true,
};

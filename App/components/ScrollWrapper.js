    // ===========================================================
//  INSQUIZ - ScrollWrapper
//  ScrollView con barra de desplazamiento tipo Google (sutil)
// ===========================================================

import React, { useState } from "react";
import { View, ScrollView, Animated } from "react-native";

export default function ScrollWrapper({ children, style }) {
  const [scrollY, setScrollY] = useState(0);
  const [contentH, setContentH] = useState(1);
  const [viewH, setViewH] = useState(1);

  // Altura mínima de la barra visual
  const indicatorH = Math.max((viewH / contentH) * viewH, 22);

  const indicatorY = (scrollY / contentH) * viewH;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={style}
        onScroll={e => {
          setScrollY(e.nativeEvent.contentOffset.y);
          setContentH(e.nativeEvent.contentSize.height);
          setViewH(e.nativeEvent.layoutMeasurement.height);
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {/* Barra ultra-sutil al estilo Google */}
      <Animated.View
        style={{
          position: "absolute",
          right: 3,
          top: indicatorY,
          width: 3,
          height: indicatorH,
          backgroundColor: "rgba(0,0,0,0.18)",
          borderRadius: 3, 
          opacity: 0.55,
        }}
      />
    </View>
  );
}

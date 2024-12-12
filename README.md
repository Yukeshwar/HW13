# HW13 Template

Arduino reads a button on pin 2 and a potentiometer on pin A0 and passes those values on to the p5js sketch via a Serial connection.

The object that is created and sent to p5js looks like this:

```
data = {
  A0: { value: integer },
  D2: {
    isPressed: boolean,
    count: integer
  }
}
```

In p5js `A0.value` is used to change ellipse size, `D2.isPressed` is used to add new ellipses to an array and `D2.count` is used to change the color of new ellipses.

import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from "@material-ui/core/Paper";
import { Container, Button } from "@material-ui/core";

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { 
      data: {},
      labels: [],
      meals: [],
      persons: [{person1: "None"},{person2: "None"}],
      selected: { meal: "None", drink: "None"}
    };
  }

  select_drink = (id, drink) => {
    this.state.meals.forEach(meal => {
      if (meal.id === id) {
        this.setState({
          selected: {meal: meal, drink: drink}
        })
      }
    });
  }

  async componentDidMount() {
    await fetch('http://localhost:4000/api', {
      }, {
        mode: 'cors',
        method: 'get',
        url: `http://localhost:4000`,
        credentials: 'include'
      })
      .then(response => {
        return response.json()
      })
      .then(data => {
        this.setState({
          data: data.data,
          labels: data.data.labels,
          meals: data.data.meals
        })
      })
  }

  render() {
      return (
        <React.Fragment>
          <CssBaseline />
          <Container class="container">
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Paper class="paper">
                  {this.state.labels.map(value => (
                    <Button class="primary" key={value.id}>{value.label}</Button>
                  ))}
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper class="paper">Persons</Paper>
              </Grid>
              {this.state.meals.map(meal => (
                <Grid key={meal.id} item xs={8}>
                  <Paper class="paper">
                    <Grid container>
                      <Grid item xs={4}>
                        <img class="image" src={meal.img}></img>
                      </Grid>
                      <Grid item xs={8}>
                        <p>{meal.title} + drink</p>
                        <p>{meal.starter}</p>
                        <p>{meal.desert}</p>
                        <p>Selected drink: {this.state.selected.meal.id === meal.id ? this.state.selected.drink.title : "None"}</p>
                        <Grid container>
                          <Grid item xs={6}>
                            {meal.drinks.map(drink => (
                              <Button key={drink.id} onClick={() => this.select_drink(meal.id, drink)}>{drink.title}</Button>
                            ))}
                          </Grid>
                          <Grid item xs={4}>
                            <p>PRICE: {meal.price}</p>
                            <Button>Select</Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </React.Fragment>
      );
    }
}

export default App;

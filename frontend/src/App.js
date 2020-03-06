import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from "@material-ui/core/Paper";
import { Container, Button, Select, MenuItem } from "@material-ui/core";
import update from 'immutability-helper';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { 
      data: {},
      labels: [],
      meals: [],
      showed_meals: [],
      selected_tag: "None",
      selected_drink: { meal: "None", drink: "None"},
      selected_person: "person1",
      selected_meal: {},
      meals_list: [],
      total_price: 0,
    };
  }

  select_drink = (id, drink) => {
    this.state.meals.forEach(meal => {
      if (meal.id === id) {
        this.setState({
          selected_drink: {meal: meal, drink: drink}
        })
      }
    });
  }

  change_person = async event => {
    await this.setState({
      selected_person: event.target.value
    })
    this.set_total_price()
  }

  change_tag = async (tag) => {
    await this.setState({
      selected_tag: tag
    })
    this.set_showed_meals()
  }

  set_showed_meals = () => {
    this.setState({
      showed_meals: []
    })
    if (this.state.selected_tag === "None") {
      this.setState({
        showed_meals: this.state.meals
      })
    }
    else {
      this.state.meals.forEach(meal => {
        meal.labels.forEach(label => {
          if (label === this.state.selected_tag.toLowerCase()) {
            this.setState(state => {
              const showed_meals = state.showed_meals.concat(meal)
              return {showed_meals}
            })
          }
        })
      })
    }
  }

  set_meal = async (meal) => {
    var drink = "None"

    if (this.state.selected_drink.meal.id === meal.id) {
      drink = this.state.selected_drink.drink
    }

    this.setState({
      selected_meal: {person: this.state.selected_person, meal: meal, drink: drink,}
    })

    await this.setState(state => {
      const meals_list = state.meals_list.concat(state.selected_meal)
      return {meals_list}
    })
    this.set_total_price()
}

  set_total_price = () => {
    var total_price = 0

    this.state.meals_list.forEach(item => {
      if (this.state.selected_person === item.person) {
        total_price = total_price + item.meal.price + item.drink.price
      }
    })
    
    this.setState({
      total_price: total_price.toFixed(2)
    })
  }

  deselect = async (id) => {
    await this.setState(state => {
      const meals_list = state.meals_list.filter((item, index) => id !== index);
      return {meals_list}
    });
    this.set_total_price()
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
          meals: data.data.meals,
          showed_meals: data.data.meals
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
                    <Button style={{margin:10}} variant="outlined" onClick={() => this.change_tag(value.label)} key={value.id}>{value.label}</Button>
                  ))}
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper class="paper">
                  <p>SELECT PERSON</p>
                  <Select
                    value={this.state.selected_person}
                    onChange={this.change_person}
                   >
                  <MenuItem value={"person1"}>Person1</MenuItem>
                  <MenuItem value={"person2"}>Person2</MenuItem>
                </Select>
                {this.state.meals_list.map((meal, index) => (
                    <Container>
                      {this.state.selected_person === meal.person ? 
                        <p>{meal.meal.title}: {meal.meal.price}$,
                          {meal.drink.title}: {meal.drink.price}$
                          <Button key={index} onClick={() => this.deselect(index)} variant="outlined">Deselect</Button></p>: <p></p>
                      }
                    </Container>
                  ))}
                  <p>Total price: {this.state.total_price}</p>
                </Paper>
              </Grid>
              {this.state.showed_meals.map(meal => (
                <Grid key={meal.id} item xs={8}>
                  <Paper class="paper">
                    <Grid container>
                      <Grid item xs={4}>
                        <img class="image" src={meal.img}></img>
                      </Grid>
                      <Grid item xs={8}>
                        <p>{meal.title} + drink</p>
                        <p>Starter: {meal.starter}</p>
                        <p>Desert: {meal.desert}</p>
                        <p>Selected drink: {this.state.selected_drink.meal.id === meal.id ? this.state.selected_drink.drink.title : "None"}</p>
                        <Grid container>
                          <Grid item xs={6}>
                            {meal.drinks.map(drink => (
                              <Button style={{margin:5}} variant="outlined" key={drink.id} onClick={() => this.select_drink(meal.id, drink)}>{drink.title}</Button>
                            ))}
                          </Grid>
                          <Grid item xs={4}>
                            <p>PRICE: {this.state.selected_drink.meal.id === meal.id ? (meal.price + this.state.selected_drink.drink.price).toFixed(2) : meal.price}</p>
                            <Button variant="outlined" onClick={() => this.set_meal(meal)}>Select</Button>
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

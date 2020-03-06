import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from "@material-ui/core/Paper";
import Pagination from '@material-ui/lab/Pagination';
import { Container, Button, Select, MenuItem, Box } from "@material-ui/core";

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
      pagination_count: 0,
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

  set_pagination = (array) => {
    this.setState({
      pagination_count: Math.ceil(array.length/3)
    })
  }

  change_page = (event, page) => {
    this.setState({
      showed_meals: []
    })
    const up_slice = page * this.state.pagination_count
    const down_slice = (page - 1) * this.state.pagination_count
    this.setState({
      showed_meals: this.state.meals.slice(down_slice, up_slice)
    })
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
    this.set_pagination(this.state.showed_meals)
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
        if (item.drink === "None") {
          total_price = total_price + item.meal.price
        }
        else {
          total_price = total_price + item.meal.price + item.drink.price
        }
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
          showed_meals: data.data.meals.slice(0, 3)
        })
      })
    this.set_pagination(this.state.meals)
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
                            {meal.drink.title || "No drink"}: {meal.drink.price || 0}$
                          <Button key={index} onClick={() => this.deselect(index)} variant="outlined">Deselect</Button></p>: <p></p>
                      }
                    </Container>
                  ))}
                  <p>Total price: {this.state.total_price}$</p>
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
            <Grid container>
              <Grid item xs={8}>
              <Box 
                  display="flex" 
                  alignItems="center"
                  justifyContent="center"
                  >
                    <Pagination id="pagination" count={this.state.pagination_count} onChange={(event, page) => this.change_page(event, page)} style={{margin:5}} variant="outlined" shape="rounded" />
                </Box>
              </Grid>
              <Grid item xs={4}></Grid>
            </Grid>
          </Container>
        </React.Fragment>
      );
    }
}

export default App;

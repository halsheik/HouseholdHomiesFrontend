import React from 'react';
import axios  from 'axios';


class createGroupForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          houseName: "",
          members: [{name: "", number: ""}],
          chores: [""],
          errors: []
      };
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    addClick(){
      this.setState(prevState => ({ 
          members: [...prevState.members, { name: "", number: "" }],
          chores: [...prevState.chores, ""]
      }))
    }
    
    createUI(){
       return this.state.members.map((el, i) => (
         <div key={i}>
              <input placeholder="John Smith" name="name" value={el.name ||''} onChange={this.handleChange.bind(this, i)} />
            <input placeholder="+1##########" name="number" value={el.number ||''} onChange={this.handleChange.bind(this, i)} />
              <input type='button' value='remove' onClick={this.removeClick.bind(this, i)}/>
         </div>          
       ))
    }

    createUIDChores(){  
      return this.state.chores.map((el, i) => (i===0 ? (<div key={i}><input placeholder="Chores" name="chores" value="Organizer"/></div>): (<div key={i}><input placeholder="Chores" name="chores" value={el} onChange={this.handleChangeChores.bind(this, i)} /></div>)))
     }
    
    handleChange(i, e) {
         const { name, value } = e.target;
       let members = [...this.state.members];
       members[i] = {...members[i], [name]: value};
       this.setState({ members });
    }
    handleChangeChores(i, e) {
        const {  value } = e.target;
      let chores = [...this.state.chores];
      chores[i] = {...chores[i], value};
      this.setState({ chores });
   }
    handleHouseNameChange(e) {
        this.setState({houseName: e.target.value});
    }
    
    removeClick(i){
       let members = [...this.state.members];
       members.splice(i, 1);
       let chores = [...this.state.chores];
       chores.splice(i,1);
       this.setState({ members, chores});
    }
    
    handleSubmit(event) {
      event.preventDefault();
      console.log(this.state);
        axios.post("http://localhost:4000/createGroup", this.state)
        .then((response) => {
            this.setState({ errors: [] });
            //setInterval for every week
            setInterval(() => {
            axios.put("http://localhost:4000/updateHead")
            .then((response) => {
              
            })
            }, 604800000);

            //setInterval for every day
            setInterval(() => {
            axios.get("http://localhost:4000/sendChores")
            .then((response) => {
              //all good and text shouldve sent
            })
            }, 864000);
            console.log(response);

            if(response.status === 200 && response.data === "OK" && window) {
                console.log("redirecting to homepage");
                this.setState({ members: [], chores: []});
                window.location.href = "/"; 
            } else {
                this.setState({ errors: response.data });
                console.log(this.state);
            }
        })
        .catch(err => console.log(err.data))
    }
  
    render() {
        const{houseName} = this.state;
      return (
        <form onSubmit={this.handleSubmit}>
            {/* <div>Please submit your Household Name</div>
            <input placeholder="Household Name" name="houseName" value={houseName} onChange={this.handleHouseNameChange.bind(this)} /> */}
            <div>Add all household members' name and number</div>
            {this.createUI()}        
            <input type='button' value='add more' onClick={this.addClick.bind(this)}/>
            <div>For the first chore box please input "Organizer"</div>
            <div>Evenly split chores into n-1 groups for the other boxes</div>
            {this.createUIDChores()} 
            <input type="submit" value="Submit" />
        </form>
      );
    }
  }
  

export default createGroupForm;
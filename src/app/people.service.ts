import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Person } from './person';

const baseUrl: string = 'https://swapi.co/api';

const PEOPLE : Person[] = [
      {id: 1, name: 'Luke Skywalker', height: 177, weight: 70},
      {id: 2, name: 'Darth Vader', height: 200, weight: 100},
      {id: 3, name: 'Han Solo', height: 185, weight: 85},
    ];

    @Injectable()
    export class PeopleService{


      constructor(private http : Http){}

      getAll(): Observable<Person[]>{
        let people$ = this.http
          .get(`${baseUrl}/people`, { headers: this.getHeaders()})
          .map(mapPersons);
          return people$;
      }

      private getHeaders(){
        // I included these headers because otherwise FireFox
        // will request text/html
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        return headers;
      }
      get(id: number): Observable<Person> {
        let person$ = this.http
          .get(`${baseUrl}/people/${id}`, {headers: this.getHeaders()})
          .map(mapPerson);
          return person$;
      }

      save(person: Person) : Observable<Response>{
        // this won't actually work because the StarWars API
        // is read-only. But it would look like this:
        return this
          .http
          .put(`${baseUrl}/people/${person.id}`,
                JSON.stringify(person),
                {headers: this.getHeaders()});
      }

    }


    function mapPersons(response:Response): Person[]{
      // The response of the API has a results
      // property with the actual results
      return response.json().results.map(toPerson)
    }

    function toPerson(r:any): Person{
      let person = <Person>({
        id: extractId(r),
        url: r.url,
        name: r.name,
        weight: Number.parseInt(r.mass),
        height: Number.parseInt(r.height),
      });
      console.log('Parsed person:', person);
      return person;
    }

    // to avoid breaking the rest of our app
    // I extract the id from the person url
    function extractId(personData:any){
      let extractedId = personData.url.replace(baseUrl+'/people/','').replace('/','');
      return parseInt(extractedId);
    }

    function mapPerson(response:Response): Person{
       // toPerson looks just like in the previous example
       return toPerson(response.json());
    }

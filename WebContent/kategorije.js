Vue.component('kategorije', {
    data : function() {
        return{
            naziv : undefined,
            opis : undefined,
            izmena : false,
            kategorije : null
        }
    },
    template : `
        <div v-if="kategorije">
            <div class="content-wrap">
                <h5 class="title" v-if="izmena"><span class="text"><b>Izmeni kategoriju</b></span></h5>
                <h5 class="title" v-else><span class="text"><b>Dodaj kategoriju</b></span></h5>
                <form action="#" method="post" accept-charset="UTF-8">
                    <div class="form-group">
                        <label class="labels" for="inputNaziv">Naziv</label>
                        <input type="text" class="form-control" id="inputNaziv" placeholder="Unesite naziv kategorije" v-model="naziv" :readonly="izmena">
                        <div class="invalidacija-feed"> {{nazivValidacija}} </div>
                    </div>
                    <div class="form-group">
                        <label class="labels" for="inputOpis">Opis</label>
                        <textarea id="inputOpis" class="form-control" placeholder="Unesite opis kategorije" rows="3" v-model="opis"></textarea>
                        <div class="invalidacija-feed"> {{opisValidacija}} </div>
                    </div>
                    <span v-if="izmena">
                        <button class="btn btn-light" type="submit" v-on:click.prevent="izmenaSubmit">Izmeni</button>
                        <button class="btn btn-light" v-on:click.prevent="odustaniSubmit">Odustani</button>
                    </span>
                    <span v-else><button class="btn btn-light" type="submit" v-on:click.prevent="kategorijaSubmit">Dodaj</button></span>
                    
                    
                </form>	
            </div>
            <div class="content-wrap">
                <h5 class="title"><span class="text"><b>Kategorije</b></span></h5>
                <div class="row">
                    <div class="col-3" v-for="kat in kategorije" v-show="!kat.obrisana">
                        <div class="kategorija-wrap">
                            <p><h5 class="text-uppercase">{{kat.naziv}}</h5></p>
                            <p>{{kat.opis}}</p>
                            <span>
                                <button class="btn btn-light" v-on:click="izmeni(kat)">Izmeni</button>
                                <button class="btn btn-danger" v-on:click="obrisi(kat)">Obrisi</button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    computed : {
        nazivValidacija : function() {
            if(this.naziv === '') {
                return 'Niste uneli naziv kategorije';
            } else {
                return null;
            }
        },
        opisValidacija : function() {
            if(this.opis === '') {
                return 'Niste uneli opis kategorije';
            } else {
                return null;
            }
        },
    },
    methods: {
        kategorijaSubmit : function() {
            var kategorija = {
                "naziv" : this.naziv,
                "opis" : this.opis
            };

            var ok = true;

            if(this.naziv != undefined) {
                this.naziv.trim();
            } else {
                this.naziv = '';
            }

            if(this.opis != undefined) {
                this.opis.trim();
            } else {
                this.opis = '';
            }

            if(this.naziv === undefined || this.naziv === '' || this.opis === undefined || this.opis === '') {
                ok = false;
            } else {
                ok = true;
            }

            var kat = this;
            if(ok) {
                axios.post('rest/kategorije/dodaj', kategorija) 
                    .then(function(response) {
                        app.kategorije = response.data;
                        kat.kategorije = app.kategorije;
                        kat.naziv = undefined;
                        kat.opis = undefined;
                    })
                    .catch(function(error) {
                        alert(error.response.data);
                    })
            }
        },
        izmenaSubmit : function() {
            var kategorija = {
                "naziv" : this.naziv,
                "opis" : this.opis
            };

            var ok = true;

            if(this.naziv != undefined) {
                this.naziv.trim();
            } else {
                this.naziv = '';
            }

            if(this.opis != undefined) {
                this.opis.trim();
            } else {
                this.opis = '';
            }
            
            if(this.naziv === undefined || this.naziv === '' || this.opis === undefined || this.opis === '') {
                ok = false;
            } else {
                ok = true;
            }

            var kat = this;
            if(ok) {
                axios.put('rest/kategorije/izmeni/' + kat.naziv, kategorija) 
                    .then(function(response) {
                        app.kategorije = response.data;
                        kat.kategorije = app.kategorije;
                        kat.izmena = false;
                        kat.naziv = undefined;
                        kat.opis = undefined;
                    })
                    .catch(function(error) {
                        alert(error.response.data);
                    })
            }
        },
        izmeni : function(kat) {
            this.izmena = true;
            this.naziv = kat.naziv;
            this.opis = kat.opis;
        },

        odustaniSubmit : function() {
            this.izmena = false;
            this.naziv = undefined;
            this.opis = undefined;
        },
        obrisi : function(kat) {
            var kategorija = this;
            axios.delete('rest/kategorije/obrisi/' + kat.naziv) 
                .then(function(response) {
                    app.kategorije = response.data;
                    kategorija.kategorije = app.kategorije;
                })
                .catch(function(error) {
                    alert(error.response.data);
                })
        }
    },
    mounted : function() {
        var ap = this;
        axios.get('rest/kategorije/')
            .then(function(response){
                app.kategorije = response.data;
                ap.kategorije = app.kategorije;
            })
            .catch(function(error) {
                alert(error.response.data);
            })
    }
});


Vue.component('kategorija', {
    data : function() {
        return {
            kategorija : null,
            oglasi : null,
        }
    },
    mounted : function() {
        var kThis = this;
        axios.get('rest/kategorije/' + this.$route.query.kategorija)
            .then(response => {kThis.kategorija = response.data;})
            .catch(error => {alert(error.response.data);})
    },
    template : `
    <div class="content-wrap" v-if="kategorija && oglasi">
        <h5 class="title"><span class="text"><b>{{kategorija.naziv}}</b></span></h5>
        <p class="labels">{{kategorija.opis}}</p>
        <div class="row">
            <div class="col-3" v-for="oglas in oglasi" v-if="!oglas.obrisan && oglas.aktivan == 0">
                <div class="element-wrap">
                    <router-link :to="{path : '/oglas', query : {oglas : oglas.naziv}}">
                        <a class="tabic">
                            <p><img :src="oglas.nazivSlike" class="img-slika"></p>
                            <p><h5 class="text-uppercase">{{oglas.naziv}}</h5></p>
                            <p><span class="cena">{{oglas.cena}}€</span></p>
                        </a>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    `,
    watch : {
        kategorija : function() {
            if(this.kategorija != null) {
                var kThis = this;
                axios.get('rest/oglasi/kategorija/' + this.kategorija.naziv)
                    .then(response => {kThis.oglasi = response.data;})
                    .catch(error => {alert("Neuspesno ucitavanje oglasa");})
            }
            else {
                this.oglasi = '';
            }
        },
        query : function() {
            var kThis = this;
        axios.get('rest/kategorije/' + this.$route.query.kategorija)
            .then(response => {kThis.kategorija = response.data;})
            .catch(error => {alert(error.response.data);})
        }
    },
    computed : {
        query : function() {
            return this.$route.query.kategorija;
        } 
    },
    methods : {

    }
});
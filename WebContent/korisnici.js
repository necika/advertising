Vue.component('korisnici', {
    data : function() {
        return{
            korisnici : null,
        }
    },
    template: `<div class="content-wrap" v-if="korisnici">
    <p><h4 class="text-uppercase labels">korisnici</h4></p>
    <div class="row">
        <div class="col" v-for="korisnik in korisnici"  v-show="!ulogovani || korisnik.korisnickoIme != ulogovani">
            <div class="element-wrap">
                <router-link v-bind:to="{ 
                                    path: '/korisnik',
                                    query: {
                                        korisnik : korisnik.korisnickoIme
                                    }
                                }">
                    <p>{{korisnik.uloga}}</p>
                    <p class="text-uppercase">{{korisnik.ime}} {{korisnik.prezime}}</p>
                    <p><h5>{{korisnik.korisnickoIme}}</h5></p>
                    <p>{{korisnik.email}}</p>
                    <p>{{korisnik.telefon}}</p>
                </router-link>
            </div>
        </div>
    </div>
</div>`,
    computed : {
        ulogovani : function() {
            if(app.korisnik != null) {
                return app.korisnik.korisnickoIme;
            }

            return null;
        }
    },
    mounted : function() {
        var korApp = this;
        axios.get('rest/korisnici/users')
        .then(function(response) {
            korApp.korisnici = response.data;
        })
        .catch(function(error) {
            alert(error.response.data);
        })
    }
});
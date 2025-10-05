# SmartSpirit Projesi - Docker Hub Üzerinden Çalıştırma Rehberi

Bu projeyi **bilgisayarınızda derlemeden**, doğrudan Docker Hub'daki hazır imajları kullanarak hızlıca çalıştırabilirsiniz.

Aşağıdaki adımları takip edin:

---

## Gereksinimler

- [Docker](https://www.docker.com/products/docker-desktop) yüklü olmalı

---

## 1. Hızlı Başlangıç: Docker Pull ve Run

### Backend (Spring Boot) Servisini Çalıştırmak

```sh
docker pull semaozylmz/smartspirit-backend:latest
docker run -d -p 8080:8080 --name smartspirit-backend semaozylmz/smartspirit-backend:latest
```
> Artık backend servisine [http://localhost:8080](http://localhost:8080) adresinden ulaşabilirsiniz.

---

### Frontend (React) Servisini Çalıştırmak

```sh
docker pull semaozylmz/smartspirit-frontend:latest
docker run -d -p 3000:80 --name smartspirit-frontend semaozylmz/smartspirit-frontend:latest
```
> Artık frontend arayüzüne [http://localhost:3000](http://localhost:3000) adresinden ulaşabilirsiniz.

---

## 2. Tüm Servisleri Birlikte docker-compose ile Çalıştırmak

Çalıştırmak için terminalde:
```sh
docker-compose pull        # Tüm imajları Docker Hub'dan çeker
docker-compose up -d       # Tüm servisleri başlatır
```

---

## 3. Servislere Erişim

- **Backend:** [http://localhost:8080](http://localhost:8080)
- **Frontend:** [http://localhost:3000](http://localhost:3000)

---

## 4. Servisleri Durdurmak

Tek tek durdurmak için:
```sh
docker stop smartspirit-backend smartspirit-frontend smartspirit-db
```
veya docker-compose kullandıysanız:
```sh
docker-compose down
```

---

## Otomatik Oluşturulan Yönetici (Admin) Kullanıcısı

Sistemde otomatik olarak aşağıdaki bilgilerle bir yönetici (admin) kullanıcısı oluşturulur:

- **Kullanıcı adı:** `admin`
- **Şifre:** `12345678`
- **Rol:** `Admin`

İlk girişte bu bilgileri kullanarak oturum açabilirsiniz.

---

## Notlar

- Kodunuzu klonlamanıza veya derlemenize gerek yoktur, tüm imajlar Docker Hub'dan çekilecektir.
- Sunucu veya local makine fark etmeksizin aynı adımları uygulayabilirsiniz.
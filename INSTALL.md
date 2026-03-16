# Telepítési útmutató

## Helyi fejlesztés
1. Klónozd a repository-t.
2. Indítsd el a Docker Desktop-ot.
3. Futtasd: `docker-compose up -d --build`
4. Frontend: http://localhost:4200
5. Backend: http://localhost:5000

## Kubernetes telepítés
1. Telepítsd a Kubernetes-t (pl. minikube vagy kind).
2. Telepítsd az alkalmazást Helm chart-tal:
   ```
   helm install alkfejl helm/alkfejl
   ```
3. Ellenőrizd a szolgáltatásokat:
   ```
   kubectl get services
   ```

> Ha csak a manifesteket akarod használni (helm nélkül), futtasd:
> ```
> kubectl apply -f k8s/
> ```
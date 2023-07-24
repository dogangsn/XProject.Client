import { Injectable } from '@angular/core';
import { StorageDto } from 'app/core/models/storage/StorageDto';
import jwtDecode from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class GeneralService {
    static tokenInfoModel: StorageDto;

    static tokenInfo(): StorageDto {
        const result = localStorage.getItem('accessToken');
        this.tokenInfoModel = jwtDecode(result) as StorageDto;
        return this.tokenInfoModel;
    }

}